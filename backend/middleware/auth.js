const jwt = require('jsonwebtoken');

module.exports = (req, res, next) =>{
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, '59UiBWftCNG2gqz9bBgy1rYQUkOx9Ewg1o8yEJp2AKIVaunSJt');
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId ) {
            throw 'User ID invalide !';
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({ error : error | 'Requête non authentifiée ! '});
    }
}