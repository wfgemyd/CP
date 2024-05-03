require('dotenv').config();
// authorize.js

const jwt = require('jsonwebtoken');
const rolePermissions = {
    tickets: {
        Administrator: true, // Full access
        Manager: true, // Limited to managed categories
        User: false, // No access or limited access if needed
        'New Employee': false // No access
    }
};

function authorize(req, res, next) {
    const token = req.headers.authorization;
    const requestedPath = req.path; // Use req.path to get the path of the request

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
            console.error(err);
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = decoded;

        // Check if the route is part of the tickets module and if the role is permitted
        if (requestedPath.includes('/api/tickets' || '/api/new_ticket' || '/api/archive')) {
            const isAllowed = rolePermissions.tickets[req.user.role] || false;
            if (!isAllowed) {
                return res.status(403).json({ message: 'You do not have permission to access this route' });
            }
        }

        // Special handling for new employees
        if (req.user.role === 'New Employee' && !requestedPath.startsWith('/api/onboarding')) {
            return res.status(403).json({ message: 'You do not have permission to access this route' });
        }

        next();
    });
}


module.exports = authorize;
