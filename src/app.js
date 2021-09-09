const expres = require('express');
const app = expres();
const cors = require('cors');
const { authRouter } = require('./middleware/authMiddleware');
const { gameRouter } = require('./middleware/gameMiddleware');
const { userGameRouter } = require('./middleware/userGameMiddleware');
const { userFriendRouter } = require('./middleware/userFriendMiddleware');
const { profileRouter } = require('./middleware/profileMiddleware');
const PORT  = process.env.PORT || 8081;
const path = require('path');
const publicPath = path.join(__dirname, '..', '/public');


app.use(cors());
app.use(expres.json());
app.use(expres.static(publicPath));
app.get(['/','/games','/friends','/profile', '/library'], (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
 });
app.use(`/api/auth`, authRouter);
app.use(`/api/steam/games`, gameRouter);
app.use(`/api/user/games`, userGameRouter);
app.use(`/api/user/friends`, userFriendRouter);
app.use(`/api/user/profile`, profileRouter);

app.listen(PORT, () => { console.log(`server is running on port: ${PORT}`) });