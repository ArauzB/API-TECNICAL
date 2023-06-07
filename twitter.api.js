require('dotenv').config();
const {TwitterApi} = require('twitter-api-v2');

const clientTwitter = new TwitterApi({
    appKey: process.env.TWITTER_CONSUMER_KEY,
    appSecret: process.env.TWITTER_CONSUMER_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });

  const bearer = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);
  const twitterClient = clientTwitter.readWrite;
  const twitterBearer = bearer.readOnly;
  
  module.exports = { twitterClient, twitterBearer };

  
