const joi = require('joi');

const userValidatorSchema = joi.object().keys({
    email: joi.string()
        .allow('')
        .email(),
    // уникальность и обязательность проверяется в схеме пользователя
    password: joi.string()
        .allow('')
        .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)),
}) 

const userValidator = async (email, password) => {
    try{
        await userValidatorSchema.validateAsync({email, password});
    }
    catch(e){
        throw new Error(e.message);
    }
}

module.exports = { userValidator };