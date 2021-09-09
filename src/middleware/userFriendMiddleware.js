const express = require('express');
const userFriendRouter = express.Router();
const { tokenValidation } = require('./../validation/tokenValidation');
const { user } = require('./../mongo/mongoConnect');
const { errorHandler } = require('./../handler/errorHandler');
let validUser;
userFriendRouter.use('/*', async (req, res, next) => {
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
userFriendRouter.patch(`/:friendId`, async (req, res) => {
    const friendId = req.params.friendId;
    try {
        await user.findByIdAndUpdate({ _id: validUser._id }, { $addToSet: { friends: friendId } })
    }
    catch (err) {
        return errorHandler.send500Error(res, err.message);
    }
    res.status(200).json({ message: "friend added successfully", disableAddButton: true });
    //добавить друга
})
userFriendRouter.get(`/`, async (req, res) => {
    //получить список друзей
    let result;
    try {
        const friendArr = await user.findById({ _id: validUser._id }, { friends: 1, _id: 0 });
        result = await user.find({ _id: { $in: friendArr.friends } })
    }
    catch (err) {
        return errorHandler.send500Error(res, err.message);
    }
    res.status(200).json(result);
})
userFriendRouter.get(`/:nameOrEmail`, async (req, res) => {
    //найти человека по имени или почте
    const friend = req.params.nameOrEmail;
    let result;
    try {
        result = await user.find({username: new RegExp([friend], "gi")})
        if (result.length >= 1 && Array.isArray(result)) {
            const index = result.findIndex(val => {
                if(val._id.toString() === validUser._id.toString()){
                    return true
                } 
            })
            if(index >= 0) result.splice(index, 1);
        }
    }
    catch (err) {
        return errorHandler.send500Error(res, err.message);
    }
    res.status(200).json(result ? result : []);
})
userFriendRouter.delete(`/:friendId`, async (req, res) => {
    const friendId = req.params.friendId;
    try {
        result = await user.findByIdAndUpdate({ _id: validUser._id }, { $pull: { friends: friendId } })
    }
    catch (err) {
        return errorHandler.send500Error(res, err.message);
    }
    res.status(200).json({ message: "user delete" });
    //удалить друга
})

module.exports = { userFriendRouter };