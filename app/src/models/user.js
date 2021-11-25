const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cipher = require('../utils/cipher');

const logger = require("../logger/Logger");

const collectionName = 'users';

const userSchema = new mongoose.Schema({
    sso: {
        type: String,
        unique: true,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String
    },
    email: {
        type: String,
        trim: true,
        validate(value) {
            if (!validator.default.isEmail(value)) {
                throw new Error('Invalid Email address');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 8,
        validate(value)  {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Cannot contain "password"');
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});


userSchema.methods.generateAuthToken = async function () {
    const user = this;

    const secret = 'QNT_OPEN_SECRET';

    const fullName = user.lastName + ' ' + user.firstName;
    const token = jwt.sign(
        { sso: user.sso,
                name: fullName
                }, secret);

    // Encrypt token
    const encryptedToken = cipher.encrypt(token);

    // Save encrypted token
    user.tokens = user.tokens.concat({token: JSON.stringify(encryptedToken)});
    await user.save();

    logger.info(`--- Load user token for: ${user.sso} ---`)
    return token;

}

userSchema.statics.findByCredentials = async (sso, password) => {
    const user = await User.findOne({sso});

    if (!user) {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Wrong authentication');
    }

    return user


}

// Hash the plain text password before saving
userSchema.pre('save', async function(next) {
    const user = this;

    // Create or Update password will be hashed
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
})

// Create unique SSO
userSchema.statics.createUniqueSSO = async() => {
    let uniqueSSO;
    // Find current maximum SSO number
    const registeredUser = await User.find().sort({sso: -1});

    if (registeredUser.length) {
        uniqueSSO = ++registeredUser[0].sso;
    } else {
        uniqueSSO = '100000000';
    }

    return uniqueSSO;
}

// Create username
userSchema.statics.createUsername = async(firstName, lastName) => {

    // Find current maximum SSO number
    const registeredUsers = await User.find({
        firstName: firstName,
        lastName: lastName
    })

    let username;
    if (registeredUsers.length) {
        username = firstName.toLowerCase() + '.' + lastName.toLowerCase()  + registeredUsers.length
    } else {
        username = firstName.toLowerCase()  + '.' + lastName.toLowerCase() ;
    }

    return username;
}

const User = mongoose.model(collectionName, userSchema);

module.exports = User;