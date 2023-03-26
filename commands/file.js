const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('file')
    .setDescription('Posts a link to a stored file')
    .addStringOption(option =>
      option
        .setName('name')
        .setDescription('Name of the file to post')
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply().catch((err) => console.log(err));
    const filepath = './info/links.json';
    if (fs.existsSync(filepath)) {
      const file = JSON.parse(fs.readFileSync(filepath));
      link = file[interaction.options.getString('name')];
      if (link) {
        interaction.editReply(link).catch((err) => console.log(err));
      }
      else {
        interaction.editReply('File not found. Check the name and try again.').catch((err) => console.log(err));
      }
    }
    else {
      interaction.editReply('Something went wrong reading the file containing the links. This is probably Dash\'s fault. Get him to fix it.').catch((err) => console.log(err));
    }
  },
};