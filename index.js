require('dotenv').config();
const express = require('express');


const app = express();
app.use(express.json());
const port = 3000;


const twitch = require('./twitch.api.js');
const {getStreamStatus} = require('./twitch.api.js');
const {twitterClient} = require('./twitter.api.js');


app.post('/tweet', async (req, res) => {
    const { tweet } = req.body;
    console.log (tweet);
    try {
        const response = await twitterClient.v2.tweet(tweet);
        res.status(200).json(response);
        console.log(response);
    } catch (error) {
        res.status(500).json(error);
    }
});

app.post('/twitch', async (req, res) => {
    const { username } = req.body;
    console.log (username);
    try {
        const response = await twitch.getStreamStatus(username);
        res.status(200).json(response);
        console.log(response);
    } catch (error) {
        res.status(500).json(error);
    }
});






app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});

