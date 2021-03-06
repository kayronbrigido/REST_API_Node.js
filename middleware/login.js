const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try{
        const decode = jwt.verify(req.body.token, process.env.JWT_KEY);
        req.user = decode;
        next();
    } catch (error) {
        res.status(401).send({msg: 'Unauthorized'})
    }
}