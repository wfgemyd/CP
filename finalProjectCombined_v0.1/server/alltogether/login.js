require('dotenv').config();
const jwt = require("jsonwebtoken");
const router = require('express').Router();
const db = require('./postgres');



router.post('/', async (req, res) => {
    console.log('Received login request with body:', req.body);

    const { username, password } = req.body;
    console.log('Received username:', username);
    console.log('Received password:', password);
    console.log("User attempting to log in");

    try {
        const sql = `
            SELECT u.*, r.role_name, u.f_name, u.l_name, u.id
            FROM fproject.user u
            JOIN fproject.role r ON u.role_id = r.id
            WHERE u.wbi = $1
        `;
        const values = [username];
        const result = await db.query(sql, values);
        if (result.rowCount) {
            const user = result.rows[0];
            //const passwordMatch = await bcrypt.compare(password, user.password_hash);
            const passwordMatch = user.password_hash === password;

            if (passwordMatch) {
                const tokenPayload = {
                    username: user.wbi,
                    role: user.role_name,
                    fullName: `${user.f_name} ${user.l_name}`,
                    wbi: user.wbi,
                    uId: user.id,
                };
                const token = jwt.sign(tokenPayload, process.env.SECRET, { expiresIn: '1h' });

                res.json({ token: token, role: user.role_name, fullName: tokenPayload.fullName, wbi: tokenPayload.wbi, uId: tokenPayload.uId ,success: true });
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
