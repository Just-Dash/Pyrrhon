const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const ut = require('../userTools');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tier')
    .setDescription('Upgrade your tier role.'),
  async execute(interaction) {
    let userData = ut.getUserData(interaction.user.id);
    const tierIDs = [null, '772900276117962792', '772985683312509011', '772985797266636810', '772985908281475084', '788266455786979338', '788266535969619998', '772986093070975007'];
    const tierPrice = [0, 1, 10, 15, 25, 50, 100, 200];
    const currentTier = interaction.member.roles.cache.find(r => tierIDs.includes(r.id));
    let currentTierNum = 0;
    if (currentTier) {
      currentTierNum = tierIDs.findIndex(i => i == currentTier.id);
    }

    if (currentTierNum + 1 >= tierIDs.length) {
      await interaction.reply({ content: 'You already have the max tier.', ephemeral: false });
    }
    else if (userData.points < tierPrice[currentTierNum + 1]) {
      await interaction.reply({content: `The next tier requires ${tierPrice[currentTierNum + 1]} points, but you currently have ${userData.points}.`, ephemeral: true })
    }
    else {
      let confirmation = `Your current point total is ${userData.points}.\n` +
      `After upgrading your tier, you will have ${userData.points - tierPrice[currentTierNum + 1]}.\n` +
      `Are you sure you want to upgrade your tier?`;
      const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`${interaction.id}y`)
          .setLabel('Yes')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId(`${interaction.id}n`)
          .setLabel('No')
          .setStyle(ButtonStyle.Danger),
      );
      await interaction.reply({ content: confirmation, ephemeral: false, components: [row] });
      const filter = i => i.user.id === interaction.user.id;
      const collector = interaction.channel.createMessageComponentCollector({ filter, time: 10000, max: 1 });

      collector.on('collect', async i => {
        if (i.customId === `${interaction.id}y`) {
          userData.points -= tierPrice[currentTierNum + 1];
          interaction.member.roles.add(interaction.guild.roles.cache.find(r => r.id === tierIDs[currentTierNum + 1]));
          if (currentTierNum != 0) {
            interaction.member.roles.remove(interaction.guild.roles.cache.find(r => r.id === tierIDs[currentTierNum]));
          }
          ut.writeUserData(interaction.user.id, userData);
          await i.update({ content: `Congratulations, you've been upgraded to the ${interaction.guild.roles.cache.find(r => r.id === tierIDs[currentTierNum + 1])} role!`, components: [] });
        }
        else {
          await interaction.editReply({ content: 'Tier upgrade cancelled.', components: [] });
        }
        collector.stop();
      });
    }
  },
};