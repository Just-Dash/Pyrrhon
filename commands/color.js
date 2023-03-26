const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const ut = require('../userTools');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('color')
    .setDescription('Spend points to get a color role')
    .addSubcommand(subcommand =>
      subcommand
        .setName('preset')
        .setDescription('Redeem a preset color role')
        .addRoleOption(option =>
          option
            .setName('role')
            .setDescription('The color role to be redeemed')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('custom')
        .setDescription('Redeem a custom color role')
        .addStringOption(option => 
          option
            .setName('hex')
            .setDescription('Hex code of the desired color')
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    await interaction.deferReply().catch((err) => console.log(err));
    let userData = ut.getUserData(interaction.user.id);
    const presets = ['816450131372671047', '816450254245330954', '816450336290111498', '816450360658755586', 
      '816450400106315826', '816450442371792916', '816450466996944947', '816450518770909214', '816450564145545216', 
      '816450583371317329', '816450599867645963', '816450635901304852', '816450669015203850', '816450688711131177', 
      '816450751957172224', '816450800610967603', '816450822475874385', '816450851136602172', '816450901102559273', 
      '816451079276593172', '816451126823485490', '816451165184458763', '816451276316999690', '816451303004831745', 
      '816451322639417356', '816451357509681182', '816451385062850592', '816451420059336724'];
    const presetPrice = 15;
    const customPrice = 25;
    if (interaction.options.getSubcommand() === 'preset') {
      let colorRole = interaction.options.getRole('role');
      if (!presets.includes(colorRole.id)) {
        await interaction.editReply('The role you selected is not a valid option for a preset color role.').catch((err) => console.log(err));
      }
      else if (interaction.member.roles.cache.some(r => r.id == colorRole.id)) {
        await interaction.editReply('You already possess the color role selected.').catch((err) => console.log(err));
      }
      else if (userData.points < presetPrice) {
        await interaction.editReply('You do not have enough points for a color role.').catch((err) => console.log(err));
      }
      else {
        let confirmation = '';
        let prevRole = null;
        if (interaction.member.roles.cache.some(r => r.color != 0)) {
          confirmation += 'Note that adding a new color role will remove your current one.\n';
          prevRole = interaction.member.roles.cache.find(r => r.color != 0);
        }
        confirmation += `Your current point total is ${userData.points}.\n` +
        `After changing your color, you will have ${userData.points - presetPrice}.\n`+
        `Are you sure you want to change your color?`;
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
        await interaction.editReply({ content: confirmation, ephemeral: false, components: [row] }).catch((err) => console.log(err));
        const filter = i => i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 10000, max: 1 });

        collector.on('collect', async i => {
          if (i.customId === `${interaction.id}y`) {
            userData.points -= presetPrice;
            interaction.member.roles.add(colorRole);
            if (prevRole) {
              interaction.member.roles.remove(prevRole);
            }
            ut.writeUserData(interaction.user.id, userData);
            await i.update({ content: `Updated your color role to ${colorRole}.`, components: [] }).catch((err) => console.log(err));
          }
          else {
            await interaction.editReply({ content: 'Color role change cancelled.', components: [] }).catch((err) => console.log(err));
          }
          collector.stop();
        });
      }
    }
    else {
      let hex = interaction.options.getString('hex').toUpperCase();
      const re = /[0-9A-F]{6}/g;
      if (hex[0] === '#') {
        hex = hex.substring(1);
      }
      else if (hex.substring(0, 2) === '0X') {
        hex = hex.substring(2);
      }

      if (userData.points < customPrice) {
        await interaction.editReply('You do not have enough points for a custom color role.').catch((err) => console.log(err));
      }
      else if (!re.test(hex)) {
        await interaction.editReply('Invalid hex code provided.').catch((err) => console.log(err));
      }
      else {
        let confirmation = '';
        let prevRole = null;
        if (interaction.member.roles.cache.some(r => r.color != 0)) {
          confirmation += 'Note that adding a custom color role will remove your current color role.\n';
          prevRole = interaction.member.roles.cache.find(r => r.color != 0);
        }
        confirmation += `Your current point total is ${userData.points}.\n` +
        `After changing your color, you will have ${userData.points - customPrice}.\n`+
        `Are you sure you want to change your color?`;
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
        await interaction.editReply({ content: confirmation, ephemeral: false, components: [row] }).catch((err) => console.log(err));
        const filter = i => i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 10000, max: 1});

        collector.on('collect', async i => {
          if (i.customId === `${interaction.id}y`) {
            let customRole = interaction.guild.roles.cache.find(r => r.color.toString(16).toUpperCase() == parseInt(hex, 16));
            if (!customRole) {
              customRole = await interaction.guild.roles.create({
                name: hex,
                color: parseInt(hex, 16)
              });
            }
            userData.points -= customPrice;
            interaction.member.roles.add(customRole);
            if (prevRole) {
              interaction.member.roles.remove(prevRole);
            }
            ut.writeUserData(interaction.user.id, userData);
            await i.update({ content: `Updated your color role to ${customRole}.`, components: [] }).catch((err) => console.log(err));
          }
          else {
            await interaction.editReply({ content: 'Color role change cancelled.', components: [] }).catch((err) => console.log(err));
          }
          collector.stop();
        });
      }
    }
  },
};