require('dotenv').config();

const axios = require('axios');
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const twitchClientId = process.env.TWITCH_CLIENT_ID;
const twitchAccessToken = process.env.TWITCH_ACCESS_TOKEN;
const discordToken = process.env.DISCORD_TOKEN;
const twitchUsernames = ['conterstine', 'silithur', 'crisgreen', 'rubius']; 
const discordChannelId = process.env.DISCORD_CHANEL; 


const twitchStreams = {};

client.on('ready', () => {
  console.log('¡Estoy listo!');
});

client.on('messageCreate', async (message) => {
  if (message.content === 'ping') {
    message.reply({ content: 'pong' });
  }
});

client.login(discordToken);


async function getStreamStatus(username) {
  try {
    const response = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${username}`, {
      headers: {
        'Client-ID': twitchClientId,
        'Authorization': `Bearer ${twitchAccessToken}`
      }
    });

    const streamData = response.data.data[0];

    if (streamData && streamData.type === 'live') {
      return {
        live: true,
        title: streamData.title,
        viewers: streamData.viewer_count
      };
    } else {
      return { live: false };
    }
  } catch (error) {
    console.error(`Error al obtener el estado de transmisión de Twitch para el canal ${username}:`, error.message);
    return { live: false };
  }
}

async function sendDiscordMessage(content) {
  try {
    const channel = await client.channels.fetch(discordChannelId);
    channel.send({
      content: content
    });
  } catch (error) {
    console.error('Error al enviar el mensaje a Discord:', error.message);
  }
}

async function checkStreamStatus() {
  for (const username of twitchUsernames) {
    const streamStatus = await getStreamStatus(username);

    if (streamStatus.live && !twitchStreams[username]) {
      const message = `¡Hey, ${username} está transmitiendo en vivo en https://www.twitch.tv/${username} !\nTítulo: ${streamStatus.title}\nEspectadores: ${streamStatus.viewers}`;

      sendDiscordMessage(message);

      twitchStreams[username] = true; 
    } else if (!streamStatus.live) {
      twitchStreams[username] = false; 
    }
  }
}

setInterval(checkStreamStatus, 3000);

module.exports = { getStreamStatus };
