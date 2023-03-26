const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies if online'),
  async execute(interaction) {
    await interaction.deferReply().catch((err) => console.log(err));
    await interaction.editReply('01010000 01001111 01001110 01000111').catch((err) => console.log(err));
  },
};