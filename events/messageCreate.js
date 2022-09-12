module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (!message.interaction) {
      let chance = Math.floor(Math.random() * 50);
      if (message.author.id === '274715938966863873' && chance === 10) await message.react(message.guild.emojis.cache.find(emoji => emoji.name === 'laserstaff'));
      if (message.author.id === '264111888558718988' && chance === 21) await message.react(message.guild.emojis.cache.find(emoji => emoji.name === 'kiufirework'));
    }
  },
};