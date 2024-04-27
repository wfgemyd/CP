require('dotenv').config();
const router = require('express').Router();
const db = require('./postgres');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const path = require('path');


router.get('/', async (req, res) => {
    try {
        const userId = req.user.uId;
        const result = await db.query('SELECT * FROM Fproject.get_user_tickets($1)', [userId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Failed to fetch tickets:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/:ticketId/details', async (req, res) => {
    try {
        const { ticketId } = req.params;
        const ticketDetails = await db.query('SELECT * FROM Fproject.ticket WHERE id = $1', [ticketId]);
        const ticketComments = await db.query('SELECT * FROM Fproject.ticket_comment WHERE ticket_id = $1', [ticketId]);
        const ticketEvents = await db.query('SELECT * FROM Fproject.event_store WHERE aggregate_id = $1', [ticketId]);

        // Convert attachment data to base64
        const commentsWithAttachments = ticketComments.rows.map(comment => {
            if (comment.attachment) {
                const attachmentType = comment.attachment_type || path.extname(comment.attachment_name).slice(1);

                comment.attachment = {
                    data: comment.attachment.toString('base64'),
                    type: attachmentType === 'png' ? 'image/png' : attachmentType,
                    name: comment.attachment_name,
                };
            }
            return comment;
        });

        res.json({
            ticket: ticketDetails.rows[0],
            comments: commentsWithAttachments,
            events: ticketEvents.rows
        });
    } catch (error) {
        console.error('Failed to fetch ticket details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});




router.post('/:ticketId/comment', upload.single('attachment'), async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { userId, comment } = req.body;
        const attachment = req.file ? req.file.buffer : null;
        console.log(req.file);
        const attachmentName = req.file ? req.file.originalname : null; // Get the original file name
        const attachmentType = req.file ? req.file.mimetype : null;

        await db.query('SELECT Fproject.add_ticket_comment($1, $2, $3, $4, $5, $6)', [ticketId, userId, comment, attachment, attachmentName, attachmentType]);
        res.json({ message: 'Comment added successfully' });
    } catch (error) {
        console.error('Failed to add comment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



router.get('/options', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM Fproject.get_ticket_options()');
        const options = result.rows.reduce((acc, row) => {
            if (!acc[row.option_type]) {
                acc[row.option_type] = {};
            }
            acc[row.option_type][row.option_value] = row.option_label;
            return acc;
        }, {});
        res.json(options);
    } catch (error) {
        console.error('Failed to fetch ticket options:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const ticketId = req.params.id;
        const updatedTicket = req.body;
        // Start a transaction
        await db.query('BEGIN');

        // Update the ticket fields
        await db.query(`
            UPDATE Fproject.ticket
            SET updated_at = CURRENT_TIMESTAMP
            WHERE id = $1 
        `, [ticketId]);



        // Update the ticket priority
        if (updatedTicket.priority_name) {
            const priorityId = await db.query(`
                SELECT id FROM Fproject.ticket_priorities WHERE priority_name = $1
            `, [updatedTicket.priority_name]);
            await db.query(`
                UPDATE Fproject.ticket SET priority_id = $1 WHERE id = $2
            `, [priorityId.rows[0].id, ticketId]);
        }

        // Update the assigned user
        if (updatedTicket.assigned_to_name) {
            const assignedToId = await db.query(`
                SELECT id FROM Fproject."user" WHERE CONCAT(f_name, ' ', l_name) = $1
            `, [updatedTicket.assigned_to_name]);
            await db.query(`
                UPDATE Fproject.ticket SET assigned_to = $1 WHERE id = $2
            `, [assignedToId.rows[0].id, ticketId]);
        }

        // Update the ticket category
        if (updatedTicket.category_name) {
            const categoryId = await db.query(`
                SELECT category_id FROM Fproject.categories WHERE category_name = $1
            `, [updatedTicket.category_name]);
            await db.query(`
                UPDATE Fproject.ticket SET category_id = $1 WHERE id = $2
            `, [categoryId.rows[0].category_id, ticketId]);
        }

        // Update the permission required
        if (updatedTicket.permission_required) {
            const permissionId = await db.query(`
                SELECT id FROM Fproject.permissions WHERE permission_name = $1
            `, [updatedTicket.permission_required]);
            await db.query(`
                UPDATE Fproject.ticket SET permission_required = $1 WHERE id = $2
            `, [permissionId.rows[0].id, ticketId]);
        }

        //Update the role required
        if (updatedTicket.requester_position) {
            const positionId = await db.query(`
        SELECT id FROM Fproject.position WHERE pos_name = $1
    `, [updatedTicket.requester_position]);
            await db.query(`
                UPDATE Fproject.ticket SET requested_position = $1 WHERE id = $2
            `, [positionId.rows[0].id, ticketId]);
        }

        // Update the ticket status
        if (updatedTicket.status_name) {
            const statusId = await db.query(`
                SELECT id FROM Fproject.ticket_status WHERE status_name = $1
            `, [updatedTicket.status_name]);
            await db.query(`
                UPDATE Fproject.ticket SET status_id = $1 WHERE id = $2
            `, [statusId.rows[0].id, ticketId]);
        }

        // Commit the transaction
        await db.query('COMMIT');

        res.sendStatus(200);
    } catch (error) {
        // Rollback the transaction if an error occurs
        await db.query('ROLLBACK');
        console.error('Failed to update ticket:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



module.exports = router;
