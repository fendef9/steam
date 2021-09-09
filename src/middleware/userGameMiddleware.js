const express = require('express');
const userGameRouter = express.Router();
const { user } = require('./../mongo/mongoConnect');
const { game } = require('./../mongo/mongoConnect');
const { tokenValidation } = require('./../validation/tokenValidation');
const { errorHandler } = require('./../handler/errorHandler');
let validUser;
userGameRouter.use('/*', async (req, res, next) => {
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
userGameRouter.get(`/`, async (req, res) => {
    //получить список игр пользователя
    let result;
    try {
        const arrOfGames = await user.findById({ _id: validUser._id }, { games: 1, _id: 0 });
        result = await game.find({ _id: { $in: arrOfGames.games } })
    }
    catch (err) {
        return errorHandler.send500Error(res, err.message);
    }
    res.status(200).json(result);
})
userGameRouter.patch(`/:gameId`, async (req, res) => {
    //добавить игру в библиотеку пользователя
    try {
        const gameId = req.params.gameId;
        await user.findByIdAndUpdate({ _id: validUser._id }, { $addToSet: { games: gameId } });
    }
    catch (err) {
        return errorHandler.send500Error(res, err.message);
    }
    res.status(200).json({ message: "game added successfully", disableAddButton: true });
})

module.exports = { userGameRouter };