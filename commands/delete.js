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
    const messages = interaction.options.getInteger('messages');
    if (messages < 1) {
      await interaction.reply({ content: 'Please enter a positive number of messages to delete.', ephemeral: false })
    }
    else {
      await interaction.channel.bulkDelete(messages);
      await interaction.reply(`Deleted ${messages} messages.`);
    }
  },
};