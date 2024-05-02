require('dotenv').config();
const router = require('express').Router();
const db = require('./postgres');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const path = require('path');

router.post('/:userId/new_ticket',upload.any(), async (req, res) => {
    const userId = parseInt(req.params.userId);
    const attachment = req.files ? req.files[0] : null;
    console.log('file:', attachment);

    if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }
    const {
        subject,
        content,
        status_name,
        priority_name,
        category_name,
        requested_position,

        manager_wbi,
        permission_required_name
    } = req.body;

    try {
        // Call the stored procedure with all parameters
        const result = await db.query('CALL Fproject.CreateTicket($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [
            subject,
            content,
            status_name,
            priority_name,
            parseInt(userId),
            manager_wbi,
            category_name,
            attachment ? attachment.buffer : null,
            permission_required_name,
            requested_position,
        ]);

        if (result.rows[0]) {
            res.status(201).json({ message: 'Ticket created successfully', ticketId: result.rows[0].id });
        } else {
            res.status(201).json({ message: 'Ticket created successfully' });
        }
    } catch (error) {
        console.error('Failed to create ticket:', error);
        res.status(500).json({ error: 'Failed to create ticket' });
    }
});



router.get('/:categoryName/manager', async (req, res) => {
    try {
        const { categoryName } = req.params;

        // Step 1: Find the category ID from the category name
        const categoryResult = await db.query(`
            SELECT category_id FROM Fproject.categories WHERE category_name = $1
        `, [categoryName]);

        if (categoryResult.rows.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }

        const categoryId = categoryResult.rows[0].category_id;

        // Step 2: Find the role IDs for 'Manager' and 'Administrator'
        const rolesResult = await db.query(`
            SELECT id, role_name FROM Fproject.role WHERE role_name IN ('Manager', 'Administrator')
        `);

        const roles = rolesResult.rows.reduce((acc, role) => {
            acc[role.role_name] = role.id;
            return acc;
        }, {});

        // Step 3: Find users in the specified category with 'Manager' role
        const managersResult = await db.query(`
            SELECT u.id, u.f_name, u.l_name, r.role_name, u.wbi
            FROM Fproject."user" u
            JOIN Fproject.user_categories uc ON u.id = uc.user_id
            JOIN Fproject.role r ON u.role_id = r.id
            WHERE uc.category_id = $1 AND r.id = $2
        `, [categoryId, roles['Manager']]);

        let selectedUser = managersResult.rows[0];

        if (!selectedUser) {
            // Step 4: If no manager is found, find an administrator
            const administratorsResult = await db.query(`
                SELECT u.id, u.f_name, u.l_name, r.role_name, u.wbi
                FROM Fproject."user" u
                JOIN Fproject.role r ON u.role_id = r.id
                WHERE r.id = $1
            `, [roles['Administrator']]);

            selectedUser = administratorsResult.rows[0];
        }

        if (!selectedUser) {
            return res.status(404).json({ error: 'No manager or administrator found for the selected project' });
        }

        res.json({
            id: selectedUser.id,
            name: `${selectedUser.f_name} ${selectedUser.l_name}`,
            role: selectedUser.role_name,
            wbi: selectedUser.wbi
        });
    } catch (error) {
        console.error('Failed to fetch project manager:', error);
        res.status(500).json({ error: 'Failed to fetch project manager' });
    }
});







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

router.get('/', async (req, res) => {
    try {
        const userId = req.user.uId;
        const result = await db.query('SELECT * FROM Fproject.get_user_tickets($1)', [userId]);

        // Process each ticket to include attachment details
        const ticketsWithAttachments = result.rows.map(ticket => {
            // Check if the ticket includes an attachment
            if (ticket.attachment) {
                // Assuming attachment data is already in base64 or you convert it here
                const attachmentData = Buffer.from(ticket.attachment).toString('base64');
                ticket.attachment = {
                    data: attachmentData,
                    //type: ticket.attachment_type,  // Ensure you have this column or a way to determine the type
                    //name: ticket.attachment_name   // Ensure you have this column or a way to determine the filename
                };
            } else {
                // Ensure attachment is null if not present
                ticket.attachment = null;
            }
            return ticket;
        });

        res.json(ticketsWithAttachments);
    } catch (error) {
        console.error('Failed to fetch tickets:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/:ticketId/details', async (req, res) => {
    try {
        const { ticketId } = req.params;
        const ticketDetails = await db.query('SELECT * FROM Fproject.ticket WHERE id = $1', [ticketId]);
        const ticketComments = await db.query(`
            SELECT tc.*, u.f_name, u.l_name
            FROM Fproject.ticket_comment tc
                     JOIN Fproject."user" u ON tc.user_id = u.id
            WHERE tc.ticket_id = $1
            ORDER BY tc.created_at
        `, [ticketId]);
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
        const ticketId = parseInt(req.params.id, 10); // Cast to integer
        const updatedTicket = req.body;
        console.log(updatedTicket);
        const userId = parseInt(req.user.uId, 10); // Cast to integer


        // Start a transaction
        await db.query('BEGIN');

        // Update the ticket fields
        //await db.query(`
        //    UPDATE Fproject.ticket
        //    SET updated_at = CURRENT_TIMESTAMP
        //    WHERE id = $1
        //`, [ticketId]);

// Call the UpdateTicket stored procedure with the user ID
        console.log(ticketId, userId, updatedTicket.status_name, updatedTicket.priority_name, updatedTicket.assigned_to_name, null, updatedTicket.category_name, null, null, true, updatedTicket.permission_required, updatedTicket.requester_position);
        await db.query('CALL Fproject.UpdateTicket($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)', [
            ticketId,
            userId,
            updatedTicket.status_name,
            updatedTicket.priority_name,
            updatedTicket.assigned_to_name,
            null, // p_new_fallback_approver_name
            updatedTicket.category_name,
            null, // p_comment
            null, // p_file_data
            true, // p_is_manager_or_admin
            updatedTicket.requester_position, // p_new_position_name
            updatedTicket.permission_required // p_new_permission_name
        ]);
// Update the ticket priority
        if (updatedTicket.priority_name) {
            const priorityResult = await db.query(`
        SELECT id FROM Fproject.ticket_priorities WHERE priority_name = $1
    `, [updatedTicket.priority_name]);
            const priorityId = parseInt(priorityResult.rows[0].id, 10); // Cast to integer
            await db.query(`
        UPDATE Fproject.ticket SET priority_id = $1 WHERE id = $2
    `, [priorityId, ticketId]);
        }

// Update the assigned user
        if (updatedTicket.assigned_to_name) {
            const assignedToResult = await db.query(`
        SELECT id FROM Fproject."user" WHERE CONCAT(f_name, ' ', l_name) = $1
    `, [updatedTicket.assigned_to_name]);
            const assignedToId = parseInt(assignedToResult.rows[0].id, 10); // Cast to integer
            await db.query(`
        UPDATE Fproject.ticket SET assigned_to = $1 WHERE id = $2
    `, [assignedToId, ticketId]);
        }

// Update the ticket category
        if (updatedTicket.category_name) {
            const categoryResult = await db.query(`
        SELECT category_id FROM Fproject.categories WHERE category_name = $1
    `, [updatedTicket.category_name]);
            const categoryId = parseInt(categoryResult.rows[0].category_id, 10); // Cast to integer
            await db.query(`
        UPDATE Fproject.ticket SET category_id = $1 WHERE id = $2
    `, [categoryId, ticketId]);
        }

// Update the permission required
        if (updatedTicket.permission_required) {
            const permissionResult = await db.query(`
        SELECT id FROM Fproject.permissions WHERE permission_name = $1
    `, [updatedTicket.permission_required]);
            const permissionId = parseInt(permissionResult.rows[0].id, 10); // Cast to integer
            await db.query(`
        UPDATE Fproject.ticket SET permission_required = $1 WHERE id = $2
    `, [permissionId, ticketId]);
        }

// Update the role required
        if (updatedTicket.requester_position) {
            const positionResult = await db.query(`
        SELECT id FROM Fproject.position WHERE pos_name = $1
    `, [updatedTicket.requester_position]);
            const positionId = parseInt(positionResult.rows[0].id, 10); // Cast to integer
            await db.query(`
        UPDATE Fproject.ticket SET requested_position = $1 WHERE id = $2
    `, [positionId, ticketId]);
        }

// Update the ticket status
        if (updatedTicket.status_name) {
            const statusResult = await db.query(`
        SELECT id FROM Fproject.ticket_status WHERE status_name = $1
    `, [updatedTicket.status_name]);
            const statusId = parseInt(statusResult.rows[0].id, 10); // Cast to integer
            await db.query(`
        UPDATE Fproject.ticket SET status_id = $1 WHERE id = $2
    `, [statusId, ticketId]);
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
