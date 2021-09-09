const express = require('express');
const authRouter = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { errorHandler } = require('./../handler/errorHandler');
const { user } = require('./../mongo/mongoConnect');
const { SECRET } = require('./../secret');
const {userValidator} = require("./../validation/userValidation")

authRouter.post(`/register`, async (req, res) => {
    const { email, password} = req.body;
    if(!email || !password){
        return errorHandler.send400Error(res, "All fields must be set!");
    }
    try {
        await userValidator(email,password);

        if (await user.findOne({ email })) {
            return errorHandler.send400Error(res, "User Already Exist");
        }
        const newUser = new user({
            email,
            password: await bcrypt.hash(password, 10),
        })
        await newUser.save();
    }
    catch (err) {
        return errorHandler.send500Error(res, err.message);
    }
    res.status(200).json({ message: 'Profile created successfully' })
})

authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        await userValidator(email,password);
        const findUser = await user.findOne({ email });
        if (!findUser) {
            return errorHandler.send400Error(res, 'user not found');
        }
        if (! await bcrypt.compare(password, findUser.password)) {
            return errorHandler.send400Error(res, 'wrong password');
        }
        const payload = {
            email: findUser.email,
            _id: findUser._id,
        }
        const token = jwt.sign(payload, SECRET);
        return  res.status(200).json({ jwt_token: token })
    }
    catch (err) {
        return errorHandler.send500Error(res, err.message)
    }
})

module.exports = { authRouter };