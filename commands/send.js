const { SlashCommandBuilder, AttachmentBuilder, MessageFlags } = require('discord.js');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
  .setName('send')
  .setDescription('Sends an image to Dash\'s epaper display')
  .addAttachmentOption(option =>
    option
      .setName('image')
      .setDescription('Image to be sent')
      .setRequired(true)
  ),
  async execute(interaction) {
    await interaction.deferReply().catch((err) => console.log(err));
    let img = interaction.options.getAttachment('image');

    if (img.contentType != 'image/png' && img.contentType != 'image/jpg' && img.contentType != 'image/jpeg') {
      interaction.editReply(`Invalid file type: ${img.contentType}`).catch((err) => console.log(err));
      return;
    }

    const { spawn } = require('child_process');
    const convert = spawn('python3', ['./helpers/convert.py', img.url]);

    convert.stdout.on('data', async function (data) { 
	    // interaction.editReply({content: "Dash should be receiving it shortly."}).catch((err) => console.log(err));
      const draw = spawn('python3', ['./helpers/draw.py'])
      draw.stdout.on('data', async function (data) {
        interaction.editReply({content: "Dash should be receiving this shortly.", files: ['./helpers/SPOILER_out.png']}).catch((err) => console.log(err));
      })
    });
  },
};
