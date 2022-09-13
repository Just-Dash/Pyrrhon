const { SlashCommandBuilder } = require('discord.js');
const ut = require('../userTools');

function capitalizeWeapon(weapon) {
  return weapon.replace(/\w[^\s-]*/g, function(w){
    return w.charAt(0).toUpperCase() + w.substring(1).toLowerCase();
});
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('weapon')
    .setDescription('Selects a random weapon')
    .addSubcommand(subcommand =>
      subcommand
        .setName('ban')
        .setDescription('Ban individual weapons, weapon types, the server banlist, or all weapons')
        .addStringOption(option =>
          option
            .setName('weapon')
            .setDescription('Weapon or type to be banned')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('unban')
        .setDescription('Unban individual weapons, weapon types, the server banlist, or all weapons')
        .addStringOption(option =>
          option
            .setName('weapon')
            .setDescription('Weapon or type to be unbanned')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('pick')
        .setDescription('Picks a random weapon from those unbanned on your personal weapon list')
    ),
  async execute(interaction) {
    let userData = ut.getUserData(interaction.user.id);
    if (interaction.options.getSubcommand() === 'ban' || interaction.options.getSubcommand() === 'unban') {
      let unbanFlag = interaction.options.getSubcommand() === 'unban';
      let weapon = interaction.options.getString('weapon').toLowerCase();
      const banlist = ['brawler claws', 'angel bow', 'ninja palm', 'atlas club', 'capricorn club', 'magnus club', 'predator cannon', 'eyetrack orbitars', 'gemini orbitars', 'compact arm', 'taurus arm'];
      let rangeMultiplier = -1;
      let validArg = false;
      switch (weapon) {
        case 'blade':
        case 'blades':
          rangeMultiplier = 0; break;
        case 'staff':
        case 'staffs':
        case 'staves':
          rangeMultiplier = 1; break;
        case 'claw':
        case 'claws':
          rangeMultiplier = 2; break;
        case 'bow':
        case 'bows':
          rangeMultiplier = 3; break;
        case 'palm':
        case 'palms':
          rangeMultiplier = 4; break;
        case 'club':
        case 'clubs':
          rangeMultiplier = 5; break;
        case 'cannon':
        case 'cannons':
          rangeMultiplier = 6; break;
        case 'orbitar':
        case 'orbitars':
          rangeMultiplier = 7; break;
        case 'arm':
        case 'arms':
          rangeMultiplier = 8; break;
        case 'all':
          for (key in userData.weapons) {
            userData.weapons[key] = unbanFlag;
          }
          validArg = true;
          break;
        case 'banlist':
          for (key in userData.weapons) {
            if (banlist.includes(key)) {
              userData.weapons[key] = unbanFlag;
            }
          }
          validArg = true;
          break;
      }
      if (rangeMultiplier != -1) {
        let i = 0;
        for (key in userData.weapons) {
          if (i >= rangeMultiplier * 12 && i < (rangeMultiplier + 1) * 12) {
            userData.weapons[key] = unbanFlag;
          }
          i++;
        }
        validArg = true;
      }
      else if (!validArg) {
        for (key in userData.weapons) {
          if (weapon === key) {
            userData.weapons[key] = unbanFlag;
            validArg = true;
          }
        }
        if (validArg) weapon = capitalizeWeapon(weapon);
      }
      if (validArg) {
        ut.writeUserData(interaction.user.id, userData);
        await interaction.reply(`Successfully ${interaction.options.getSubcommand()}ned ${weapon.includes(' ') ? '' : 'type '}${weapon} on your banlist.`);
      }
      else {
        await interaction.reply('Weapon or type unknown. Check your spelling and try again.');
      }
    }
    else {
      let unbannedWeapons = [];
      for (key in userData.weapons) {
        if (userData.weapons[key]) {
          unbannedWeapons = unbannedWeapons.concat([key]);
        }
      }

      if (unbannedWeapons.length <= 0) {
        await interaction.reply(`You don't have any unbanned weapons to pick from!`);
      }
      else {
        const pickedWeapon = unbannedWeapons[Math.floor(Math.random() * unbannedWeapons.length)];
        await interaction.reply(`Use the ${capitalizeWeapon(pickedWeapon)}.`);
      }
    }
  },
};