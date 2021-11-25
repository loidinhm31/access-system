const User = require('../models/user');
const logger = require("../logger/Logger");

class UserService {

    async createUser(user) {
        const newUser = new User(user);

        try {
            //
            const uniqueSSO = await  User.createUniqueSSO();
            newUser.sso = uniqueSSO;

            //
            const username = await User.createUsername(user.firstName, user.lastName);
            newUser.username = username;

            await newUser.save();

            const userToken = await newUser.generateAuthToken();

            return userToken;
        } catch (e) {
            logger.error(e.stack)
            throw new Error(e.message);
        }
    }

    async loginUser(sso, password) {
        try {
            const user = await User.findByCredentials(sso, password);

            const userToken = await user.generateAuthToken();

            return userToken;
        } catch (e) {
            e.stackTrace;
            throw new Error(e.message);
        }
    }

    async   logoutUser(req) {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        })

        await req.user.save();
    }

    async clearTokens(user) {
        user.tokens = [];
        await user.save();
    }

    async getOneUser(userSSO) {
        const user = await User.findOne({
            sso: userSSO
        });
        return user;
    }

    async updateUser(userSSO, bodyUpdate) {
        const updates = Object.keys(bodyUpdate);
        const allowedUpdates = ['lastName', 'firstName', 'email', 'password'];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            throw new Error('Invalid updates');
        }

        try {
            const user = await User.find(userSSO);

            updates.forEach((update) => user[update] = bodyUpdate[update]);

            await user.save();

            if (!user) {
                throw new Error('User was not available');
            }

            return user;
        } catch (e) {
            throw new Error('Cannot save user');
        }
    }
}

module.exports = UserService;
