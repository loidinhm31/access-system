const jwt = require('jsonwebtoken');
const User = require('../models/user');
const logger = require('../logger/Logger');
const {decode} = require("jsonwebtoken");

const auth = async (req, res, next) => {
    try {
        let token = req.header("Authorization");
        token = token.replace('Bearer ', '');
        // Decode token
        const decodedToken = jwt.verify(token, 'QNT_OPEN_SECRET');

        const user = await User.findOne({sso: decodedToken.sso});
        logger.info(`sso: ${decodedToken.sso} was authenticated`);

        if (!user) {
            throw new Error();
        }

        req.token = token;

        req.user = user;

        next();
    } catch (e) {
        res.status(401).send({
            error: 'error authenticate'
        })
    }
}
module.exports = auth;