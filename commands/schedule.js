const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('schedule')
    .setDescription('Edit the scheduled messages of the server')
    .addSubcommand(subcommand =>
      subcommand
        .setName('pause')
        .setDescription('Pause or unpause the current scheduled messages')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    await interaction.deferReply().catch((err) => console.log(err));
    let scheduledMessages = JSON.parse(fs.readFileSync('./info/scheduledMessages.json'));
    scheduledMessages.paused = !scheduledMessages.paused;
    await interaction.editReply(`Scheduled messages ${scheduledMessages.paused ? 'paused' : 'unpaused'}.`).catch((err) => console.log(err));
  },
};