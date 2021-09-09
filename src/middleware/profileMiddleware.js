const express = require('express');
const profileRouter = express.Router();
const { tokenValidation } = require('./../validation/tokenValidation');
const { user } = require('./../mongo/mongoConnect');
const { errorHandler } = require('./../handler/errorHandler');

let validUser;

profileRouter.use('/', async (req, res, next) => {
    try {
        validUser = await tokenValidation(req.headers.authorization);
        if (!validUser) {
            throw new Error(`there is no such user`)
        }
    }
    catch (err) {
        return errorHandler.send400Error(res, err.message)
    }
    next();
})
profileRouter.patch(`/`, async (req, res) => {
    //изменить данные пользователя
    let result;
    const { username, age, email } = req.body;
    let newToken;

    const changes = {
        username: username ? username : validUser._id.toString().split("@")[0],
        age: age ? age : "null",
        email
    }

    try {
        result = await user.findByIdAndUpdate({ _id: validUser._id }, changes);
        if (email !== validUser.email){
            newToken = true 
        }

    }
    catch (err) {
        return errorHandler.send500Error(res, err.message);
    }
    newToken 
    ?   res.status(200).json({token: newToken})
    :   res.status(200).json({message: `profile change successfuly`})
})
profileRouter.get(`/`, async (req, res) => {
    //получить данные пользователя
    let result;
    try {
        result = await user.findById({ _id: validUser._id }, { _id: 1, username: 1, age: 1, email: 1 });
    }
    catch (err) {
        return errorHandler.send500Error(res, err.message);
    }
    res.status(200).json(result);
})

module.exports = { profileRouter };