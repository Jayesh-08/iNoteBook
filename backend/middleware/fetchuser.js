var jwt = require('jsonwebtoken');
var JWT_SECRET = 'Iamaverygoodbo$y';

const fetchuser = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "Please authenticate a valid token" });
    }

    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate a valid token" });
    }
}

module.exports = fetchuser;