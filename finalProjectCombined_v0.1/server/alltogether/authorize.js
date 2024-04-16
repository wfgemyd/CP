require('dotenv').config();
// authorize.js

const jwt = require('jsonwebtoken');

function authorize(req, res, next) {
    const token = req.headers.authorization;
    let onboardingPath = req.headers.path;
    console.log('________________________________________________________');
    console.log('Token:', token);


    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
            console.error(err);
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = decoded;
        console.log('Role:', req.user.role);

        console.log('________________________________________________________');
        // Check the user's role
        if (req.user.role === 'New Employee') {
            // Allow access to the onboarding route for "New Employee" users
            if (onboardingPath === '/api/onboarding' || onboardingPath === '/api/onboarding/submit') {
                return next();
            } else {
                return res.status(403).json({ message: 'You do not have permission to access this route' });
            }
        }

        // Allow access to other routes for authenticated users with appropriate roles
        next();
    });
}

module.exports = authorize;
