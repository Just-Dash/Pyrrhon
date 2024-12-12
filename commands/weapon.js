const fs = require('fs');
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
        .setName('legal')
        .setDescription('Selects a random weapon from all weapons, excluding banlist weapons')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('all')
        .setDescription('Selects a random weapon from all weapons, including banlist weapons')
    ),
  async execute(interaction) {
    await interaction.deferReply().catch((err) => console.log(err));
    let pickedWeapon = "";
    const weapons = JSON.parse(fs.readFileSync('./info/weapons.json'));
    if (interaction.options.getSubcommand() === 'legal') {
      let weaponsArray = Object.entries(weapons);
      pickedWeapon = weaponsArray.filter((w) => w[1])[Math.floor(Math.random() * weaponsArray.length)][0];
    }
    else {
      let weaponsArray = Object.keys(weapons);
      pickedWeapon = weaponsArray[Math.floor(Math.random() * weaponsArray.length)];
    }
    await interaction.editReply(`Use the ${capitalizeWeapon(pickedWeapon)}.`).catch((err) => console.log(err));
  },
};