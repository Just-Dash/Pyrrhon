const { SlashCommandBuilder } = require('discord.js');
const ut = require('../userTools');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fc')
    .setDescription('Remembers 3DS friend codes')
    .addSubcommand(subcommand =>
      subcommand
        .setName('set')
        .setDescription('Set your 3DS friend code')
        .addStringOption(option =>
          option
            .setName('fc')
            .setDescription('3DS friend code to be set')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('view')
        .setDescription('View a friend code')
        .addUserOption(option =>
          option
            .setName('user')
            .setDescription('Whose friend code to be viewed')
        )
    ),
  async execute(interaction) {
    await interaction.deferReply().catch((err) => console.log(err));
    if (interaction.options.getSubcommand() === 'set') {
      let fc = interaction.options.getString('fc');
      let userData = ut.getUserData(interaction.user.id);
      fc = fc.replace(/\D/gi, '');
      if (fc.length != 12) {
        await interaction.editReply('Friend codes must be 12 digits long.').catch((err) => console.log(err));
      }
      else {
        fc = `${fc.substring(0, 4)}-${fc.substring(4, 8)}-${fc.substring(8, 12)}`;
        userData.fc = fc;
        ut.writeUserData(interaction.user.id, userData);
        await interaction.editReply(`Friend code set to ${fc}.`).catch((err) => console.log(err));
      }
    }
    else {
      let target = interaction.options.getUser('user');
      if (!target) {
        target = interaction.user;
      }
      let userData = ut.getUserData(target.id);
      let fc = userData.fc;
      if (!fc) {
        await interaction.editReply(`${target.username}'s friend code has not been set.`).catch((err) => console.log(err));
      }
      else {
        await interaction.editReply(`${target.username}'s friend code is ${userData.fc}.`).catch((err) => console.log(err));
      }
    }
  },
};