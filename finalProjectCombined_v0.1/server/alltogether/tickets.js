require('dotenv').config();
const router = require('express').Router();
const db = require('./postgres');
const jwt = require('jsonwebtoken');
//get the tickets that are relevant to the user that he created, if it is an administrator then all tickets are visiable,
// if manager only tickets that are related to the category(project) that the manager is managing.
//console.log('++++++++++++++++++++++++++++++++++++++++++');


router.get('/', async (req, res) => {
    try {
        // Extract the user ID from the JWT token payload
        const userId = req.user.uId; // This should match the payload property name you set in login.js
        // Call the stored function using SELECT statement
        const result = await db.query('SELECT * FROM Fproject.get_user_tickets($1)', [userId]);
        // Send the result rows back as JSON
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

        res.json({
            ticket: ticketDetails.rows[0],
            comments: ticketComments.rows,
            events: ticketEvents.rows
        });
    } catch (error) {
        console.error('Failed to fetch ticket details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/:ticketId/comment', async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { userId, comment } = req.body
        const result = await db.query('SELECT Fproject.add_ticket_comment($1, $2, $3)', [ticketId, userId, comment]);
        res.json({ message: 'Comment added successfully' });
    } catch (error) {
        console.error('Failed to add comment:', error);
        res.status(500).json({ message: 'Internal server error' });

    }
});
module.exports = router;

