const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('delete')
    .setDescription('Deletes multiple messages at once')
    .addIntegerOption(option => 
      option
        .setName('messages')
        .setDescription('Number of messages to delete')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    await interaction.deferReply().catch((err) => console.log(err));
    const messages = interaction.options.getInteger('messages');
    if (messages < 1) {
      await interaction.editReply('Please enter a positive number of messages to delete.').catch((err) => console.log(err));
    }
    else {
      await interaction.channel.bulkDelete(messages);
      await interaction.editReply(`Deleted ${messages} messages.`).catch((err) => console.log(err));
    }
  },
};