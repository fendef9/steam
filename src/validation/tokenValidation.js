const jwt = require('jsonwebtoken');
const { SECRET } = require('./../secret');
const { user } = require('./../mongo/mongoConnect');

const tokenValidation = async (token) => {
    const { email, _id } = jwt.verify(token.split(` `)[1], SECRET);
    if (!(email && _id)) {
        throw new Error('email or id are not defined/from:(jwt_val)');
    }
    const findUser = await user.findOne({ email, _id });
    if (!findUser) {
        throw new Error('user not found/from:(jwt_val)')
    }
    return findUser
}

module.exports = { tokenValidation };