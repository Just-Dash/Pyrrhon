const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('role')
    .setDescription('Edits your roles')
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Add yourself to a role')
        .addRoleOption(option =>
          option
            .setName('role')
            .setDescription('Role to be added')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Remove yourself from a role')
        .addRoleOption(option =>
          option
            .setName('role')
            .setDescription('Role to be removed')
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    await interaction.deferReply().catch((err) => console.log(err));
    const freeRoles = ['748387591942045696', '710670964471496744', '748388197553143859', '909645162991484948'];
    if (!freeRoles.includes(interaction.options.getRole('role').id)) {
      await interaction.editReply('Sorry, you can\'t add/remove yourself from that role.').catch((err) => console.log(err));
    }
    else if (interaction.options.getSubcommand() === 'add') {
      interaction.member.roles.add(interaction.options.getRole('role'));
      await interaction.editReply(`${interaction.options.getRole('role').name} role added.`).catch((err) => console.log(err));
    }
    else {
      interaction.member.roles.remove(interaction.options.getRole('role'));
      await interaction.editReply(`${interaction.options.getRole('role').name} role removed.`).catch((err) => console.log(err));
    }
  },
};