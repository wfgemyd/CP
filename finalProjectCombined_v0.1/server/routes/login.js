require('dotenv').config();


const express = require('express');
const router = express.Router();
const db = require('../models/postgres');


const jwt = require("jsonwebtoken");

function makeToken(user) {
    return jwt.sign(user, process.env.SECRET, { expiresIn: '12h' });
}

router.post('/', async (req, res) => {
    const { username, password } = req.body;
    console.log (username, password);
    console.log(req.body);
    try {
        console.log(req.body.username);
        const sql = `SELECT * FROM fproject.user WHERE wbi = $1`;
        const values = [req.body.username];
        const result = await db.query(sql, values);
        console.log(result.rows.length, result.rowCount);
        if (result.rowCount) {
            const user = result.rows[0];
            console.log(user);
            const passwordMatch = user.password === req.body.password;
            if (passwordMatch) {
                res.json({ token: makeToken({ username: req.body.username }) });
                console.log("User logged in successfully");
                res.json({ success: true });
            } else {
                console.log("Invalid password");
                res.status(401).end();
            }
        } else {
            res.status(401).end();
        }
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
});
module.exports = router;