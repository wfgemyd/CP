require('dotenv').config();
const router = require('express').Router();
const db = require('./postgres');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const base64ToPDF = require('base64topdf');
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





module.exports = router;
