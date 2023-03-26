const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('coin')
    .setDescription('Flips a coin'),
  async execute(interaction) {
    await interaction.deferReply().catch((err) => console.log(err));
    await interaction.editReply(`The coin landed ${Math.random() * 2 > 1 ? 'heads' : 'tails'}.`).catch((err) => console.log(err));
  },
};