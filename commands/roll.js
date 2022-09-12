const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Rolls a die')
    .addIntegerOption(option =>
      option.setName('sides')
        .setDescription('The number of sides of the die to roll')
        .setRequired(false)),
  async execute(interaction) {
    let sides = interaction.options.getInteger('sides');
    if (sides <= 0) sides = 6;
    await interaction.reply(`A ${Math.ceil(Math.random() * sides)} was rolled on a ${sides}-sided die.`);
  },
};