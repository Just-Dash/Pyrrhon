const { Client } = require("discord.js");

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (!message.interaction) {
      if (message.channel.id === '1139662709760200835' && message.author.id === '308414794304847873') {
        let space_index = message.content.search(/ /);
        let channel_id = message.content.slice(0, space_index);
        let text = message.content.slice(space_index);
        message.client.channels.fetch(channel_id).then(channel => channel.send(text));
      }
      let chance = Math.floor(Math.random() * 50);
      if (message.author.id === '274715938966863873' && chance === 10) await message.react(message.guild.emojis.cache.find(emoji => emoji.name === 'laserstaff'));
      if (message.author.id === '264111888558718988' && chance === 21) await message.react(message.guild.emojis.cache.find(emoji => emoji.name === 'kiufirework'));
    }
  },
};