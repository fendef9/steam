const express = require('express');
const gameRouter = express.Router();
const { game } = require('./../mongo/mongoConnect');
const { errorHandler } = require('./../handler/errorHandler');

gameRouter.post(`/`, async (req, res) => {
    //добавить игру в магазин
    const { name, description, price, tag } = req.body;
    try {
        if (await game.findOne({ name })) {
            return errorHandler.send500Error(res, "this game already exist");
        }
        const newGame = new game({
            name,
            description,
            price,
        })
        Array.from(tag).forEach(elem => {
            newGame.tag.push(elem)
        })
        await newGame.save();
    }
    catch (err) {
        return errorHandler.send500Error(res, err.message);
    }
    res.status(200).json({ message: 'Game added successfully' })
})
gameRouter.get(`/`, async (req, res) => {
    // получить список всех игр
    let result;
    try {
        result = await game.find({});
    }
    catch (err) {
        return errorHandler.send500Error(res, err.message);
    }
    res.status(200).json(result);
})

module.exports = { gameRouter }