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
    const freeRoles = ['1017022053167136798', '1017022100625698866'];
    if (!freeRoles.includes(interaction.options.getRole('role').id)) {
      await interaction.reply('Sorry, you can\'t add/remove yourself from that role.');
    }
    else if (interaction.options.getSubcommand() === 'add') {
      interaction.member.roles.add(interaction.options.getRole('role'));
      await interaction.reply(`${interaction.options.getRole('role').name} role added.`);
    }
    else {
      interaction.member.roles.remove(interaction.options.getRole('role'));
      await interaction.reply(`${interaction.options.getRole('role').name} role removed.`);
    }
  },
};