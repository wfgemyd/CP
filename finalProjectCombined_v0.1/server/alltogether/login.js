require('dotenv').config();
const jwt = require("jsonwebtoken");
const router = require('express').Router();
const db = require('./postgres');
const bcrypt = require('bcrypt');

function makeToken(user) {
    return jwt.sign(user, process.env.SECRET, { expiresIn: '12h' });
}
router.post('/', async (req, res) => {
    console.log('Received login request with body:', req.body);

    const { username, password } = req.body;
    console.log('Received username:', username);
    console.log('Received password:', password);
    console.log("User attempting to log in");

    try {
        const sql = `SELECT * FROM fproject.user WHERE wbi = $1`;
        const values = [username];
        const result = await db.query(sql, values);
        console.log('result:', result);
        if (result.rowCount) {
            const user = result.rows[0];
            const passwordMatch = user.password_hash === password;
            if (passwordMatch) {
                res.json({ token: makeToken({ username }), success: true });
                console.log("User logged in successfully");
            } else {
                console.log("Invalid password");
                res.status(401).json({ success: false, message: 'Invalid password' });
            }
        } else {
            res.status(401).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


module.exports = router;