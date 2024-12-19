const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const file = require('./file');

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
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('include')
        .setDescription('Include a role for users to add to themselves')
        .addRoleOption(option =>
          option
            .setName('role')
            .setDescription('Role to be included')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('exclude')
        .setDescription('Exclude a role for users to add to themselves')
        .addRoleOption(option =>
          option
            .setName('role')
            .setDescription('Role to be excluded')
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    await interaction.deferReply().catch((err) => console.log(err));
    const filepath = './info/freeRoles.json';
    let file = JSON.parse(fs.readFileSync(filepath));
    let freeRoles = file.roles;

    if ((interaction.options.getSubcommand() === 'add' || interaction.options.getSubcommand() === 'remove') && !freeRoles.includes(interaction.options.getRole('role').id)) {
      await interaction.editReply('Sorry, you can\'t add/remove yourself from that role.').catch((err) => console.log(err));
    }
    else if (interaction.options.getSubcommand() === 'add') {
      interaction.member.roles.add(interaction.options.getRole('role'));
      await interaction.editReply(`${interaction.options.getRole('role').name} role added.`).catch((err) => console.log(err));
    }
    else if (interaction.options.getSubcommand() === 'remove') {
      interaction.member.roles.remove(interaction.options.getRole('role'));
      await interaction.editReply(`${interaction.options.getRole('role').name} role removed.`).catch((err) => console.log(err));
    }
    else if (interaction.options.getSubcommand() === 'include') {
      if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
        interaction.editReply('Sorry, you can\'t add additional roles to this command.').catch((err) => console.log(err));;
      }
      else {
        if (freeRoles.includes(interaction.options.getRole('role').id)) {
          interaction.editReply(`${interaction.options.getRole('role').name} is already included in /role.`).catch((err) => console.log(err));
        }
        else {
          freeRoles.push(interaction.options.getRole('role').id);
          file.roles = freeRoles;
          fs.writeFileSync(filepath, JSON.stringify(file, null, 2));
          interaction.editReply(`${interaction.options.getRole('role').name} role added to /role.`).catch((err) => console.log(err));
        }
      }
    }
    else if (interaction.options.getSubcommand() === 'exclude') {
      if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
        interaction.editReply('Sorry, you can\'t remove roles from this command.').catch((err) => console.log(err));
      }
      else {
        freeRoles = freeRoles.filter(role => role !== interaction.options.getRole('role').id);
        file.roles = freeRoles;
        fs.writeFileSync(filepath, JSON.stringify(file, null, 2));
        interaction.editReply(`${interaction.options.getRole('role').name} role removed from /role.`).catch((err) => console.log(err));
      }
    }
  },
};