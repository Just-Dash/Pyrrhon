const { SlashCommandBuilder } = require('discord.js');
const ut = require('../userTools');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('points')
    .setDescription('Keeps track of a member\'s points.')
    .addSubcommand(subcommand => 
      subcommand
        .setName('view')
        .setDescription('View the number of points a member has.')
        .addUserOption(option =>
          option
            .setName('user')
            .setDescription('Which user\'s points to check')
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Add points to a user\'s account.')
        .addUserOption(option =>
          option
            .setName('user')
            .setDescription('The user to add points to')
            .setRequired(true)
        )
        .addIntegerOption(option =>
          option
            .setName('points')
            .setDescription('How many points to add')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('sub')
        .setDescription('Subtract points from a user\'s account.')
        .addUserOption(option =>
          option
            .setName('user')
            .setDescription('The user to subtract points from')
            .setRequired(true)
        )
        .addIntegerOption(option =>
          option
            .setName('points')
            .setDescription('How many points to subtract')
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    let target = interaction.options.getUser('user');
    if (!target) {
      target = interaction.user;
    }
    let userData = ut.getUserData(target.id);
    let flag = false;
    const tempPoints = userData.points;
    if (interaction.options.getSubcommand() === 'view') {
      await interaction.reply(`${target.username} has ${userData.points} point${userData.points != 1 ? 's' : ''}.`);
    }
    else if (!interaction.member.roles.cache.some(r => r.id == '793645964807241740')) {
      await interaction.reply('You don\'t have permission to add or subtract points.');
    }
    else if (interaction.options.getSubcommand() === 'add') {
      userData.points += interaction.options.getInteger('points');
      flag = true;
    }
    else {
      userData.points -= interaction.options.getInteger('points');
      flag = true;
    }
    if (flag) {
      ut.writeUserData(target.id, userData);
      await interaction.reply(
        `**Points balance change for <@${target.id}>**\n` +
        `Previous: ${tempPoints}\n` +
        `Current: ${userData.points}`
      );
    }
  },
};