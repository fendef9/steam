const mongoose = require('mongoose');
const { userSchema } = require("./schema/userSchema");
const { gameSchema } = require("./schema/gameSchema");
const DB_CONNECTION = "mongodb+srv://johnY:12345@cluster0.57x2y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

mongoose.connect(DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})

const user = mongoose.model(`user`, userSchema);
const game = mongoose.model(`game`, gameSchema);

module.exports = { user, game };