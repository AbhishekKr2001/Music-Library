const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
    // console.log('Session:', req.session); // Log session contents

    if (req.session.authorization) {
        const token = req.session.authorization.token;

        jwt.verify(token, 'jwt_secret_key', (error, user) => {
            if (error) {
                console.error(error); // Log the error for debugging
                return res.status(401).json({ message: 'Unauthorized' });
            }
            req.user_email = req.session.authorization.email;
            next();
        });
    } else {
        return res.status(403).json({ message: 'User not Logged In' });
    }
};
