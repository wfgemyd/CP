require('dotenv').config();
const router = require('express').Router();
const db = require('./postgres');
const jwt = require('jsonwebtoken');
//get the tickets that are relevant to the user that he created, if it is an administrator then all tickets are visiable,
// if manager only tickets that are related to the category(project) that the manager is managing.
//console.log('++++++++++++++++++++++++++++++++++++++++++');


router.get('/', async (req, res) => {
    const { role, uId } = req.user;
    try {
        let sql;
        if (role === 'Administrator') {
            sql = `
                SELECT
                    t.id,
                    t.subject,
                    t.content,
                    t.status_id,
                    ts.status_name,
                    t.priority_id,
                    tp.priority_name,
                    t.user_id,
                    u.f_name || ' ' || u.l_name AS created_by,
                    t.created_at,
                    t.updated_at,
                    t.assigned_to,
                    ua.f_name || ' ' || ua.l_name AS assigned_to_name,
                    t.category_id,
                    c.category_name,
                    COALESCE(tc.comment, '') AS last_comment,
                    COALESCE(tc.created_at, t.created_at) AS last_activity_at,
                    json_agg(
                            json_build_object(
                                    'id', tc.id,
                                    'comment', tc.comment,
                                    'user_id', tc.user_id,
                                    'created_at', tc.created_at
                            )
                    ) AS comments
                FROM
                    Fproject.ticket t
                        JOIN
                    Fproject.ticket_status ts ON t.status_id = ts.id
                        JOIN
                    Fproject.ticket_priorities tp ON t.priority_id = tp.id
                        JOIN
                    Fproject."user" u ON t.user_id = u.id
                        JOIN
                    Fproject.categories c ON t.category_id = c.category_id
                        LEFT JOIN
                    Fproject."user" ua ON t.assigned_to = ua.id
                        LEFT JOIN
                    Fproject.ticket_comment tc ON t.id = tc.ticket_id
                GROUP BY
                    t.id, ts.status_name, tp.priority_name, u.f_name, u.l_name, ua.f_name, ua.l_name, c.category_name, t.updated_at, tc.comment, tc.created_at
                ORDER BY
                    t.updated_at DESC;
            `;
        } else if (role === 'Manager') {
            sql = `
                SELECT
                    t.id,
                    t.subject,
                    t.content,
                    t.status_id,
                    ts.status_name,
                    t.priority_id,
                    tp.priority_name,
                    t.user_id,
                    u.f_name || ' ' || u.l_name AS created_by,
                    t.created_at,
                    t.updated_at,
                    t.assigned_to,
                    ua.f_name || ' ' || ua.l_name AS assigned_to_name,
                    t.category_id,
                    c.category_name,
                    COALESCE(tc.comment, '') AS last_comment,
                    COALESCE(tc.created_at, t.created_at) AS last_activity_at,
                    json_agg(
                        json_build_object(
                            'id', tc.id,
                            'comment', tc.comment,
                            'user_id', tc.user_id,
                            'created_at', tc.created_at
                        )
                    ) AS comments
                FROM
                    Fproject.ticket t
                JOIN
                    Fproject.ticket_status ts ON t.status_id = ts.id
                JOIN
                    Fproject.ticket_priorities tp ON t.priority_id = tp.id
                JOIN
                    Fproject."user" u ON t.user_id = u.id
                JOIN
                    Fproject.categories c ON t.category_id = c.category_id
                LEFT JOIN
                    Fproject."user" ua ON t.assigned_to = ua.id
                LEFT JOIN
                    Fproject.ticket_comment tc ON t.id = tc.ticket_id
                WHERE
                    t.category_id IN (
                        SELECT
                            uc.category_id
                        FROM
                            Fproject.user_categories uc
                        WHERE
                            uc.user_id = $1
                    )
                GROUP BY
                    t.id, ts.status_name, tp.priority_name, u.f_name, u.l_name, ua.f_name, ua.l_name, c.category_name, t.updated_at
                ORDER BY
                    t.updated_at DESC;
            `;
        } else {
            sql = `
                SELECT
                    t.id,
                    t.subject,
                    t.content,
                    t.status_id,
                    ts.status_name,
                    t.priority_id,
                    tp.priority_name,
                    t.user_id,
                    u.f_name || ' ' || u.l_name AS created_by,
                    t.created_at,
                    t.updated_at,
                    t.assigned_to,
                    ua.f_name || ' ' || ua.l_name AS assigned_to_name,
                    t.category_id,
                    c.category_name,
                    COALESCE(tc.comment, '') AS last_comment,
                    COALESCE(tc.created_at, t.created_at) AS last_activity_at,
                    json_agg(
                        json_build_object(
                            'id', tc.id,
                            'comment', tc.comment,
                            'user_id', tc.user_id,
                            'created_at', tc.created_at
                        )
                    ) AS comments
                FROM
                    Fproject.ticket t
                JOIN
                    Fproject.ticket_status ts ON t.status_id = ts.id
                JOIN
                    Fproject.ticket_priorities tp ON t.priority_id = tp.id
                JOIN
                    Fproject."user" u ON t.user_id = u.id
                JOIN
                    Fproject.categories c ON t.category_id = c.category_id
                LEFT JOIN
                    Fproject."user" ua ON t.assigned_to = ua.id
                LEFT JOIN
                    Fproject.ticket_comment tc ON t.id = tc.ticket_id
                WHERE
                    t.user_id = $1
                GROUP BY
                    t.id, ts.status_name, tp.priority_name, u.f_name, u.l_name, ua.f_name, ua.l_name, c.category_name, t.updated_at
                ORDER BY
                    t.updated_at DESC;
            `;

        }
        const { rows } = await db.query(sql, role === 'Manager' ? [uId] : role === 'User' ? [uId] : []);

        const ticketsById = {};

        rows.forEach(row => {
            const ticketId = row.id;
            const ticket = {
                id: row.id,
                subject: row.subject,
                content: row.content,
                status: row.status_name,
                priority: row.priority_name,
                createdBy: row.created_by,
                createdAt: row.created_at,
                updatedAt: row.updated_at,
                assignedTo: row.assigned_to_name,
                category: row.category_name,
                lastComment: row.last_comment,
                lastActivityAt: row.last_activity_at,
                comments: []
            };

            if (row.comments) {
                ticket.comments = row.comments.map(comment => ({
                    id: comment.id,
                    comment: comment.comment,
                    userId: comment.user_id,
                    createdAt: comment.created_at
                }));
            }

            if (ticketsById[ticketId]) {
                ticketsById[ticketId].comments = [...ticketsById[ticketId].comments, ...ticket.comments];
            } else {
                ticketsById[ticketId] = ticket;
            }
        });

        res.json(Object.values(ticketsById));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while retrieving tickets' });
    }
});
module.exports = router;

