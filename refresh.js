const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const auth = require('./info/auth.json');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(auth.token);

rest.put(Routes.applicationGuildCommands(auth.id, auth.guild), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);

// for deleting guild-based commands
// rest.delete(Routes.applicationGuildCommand(auth.id, auth.guild, "1016315739478704189"))
//   .then(() => console.log('Successfully deleted guild command'))
//   .catch(console.error);

// for deleting ALL guild-based commands
// rest.put(Routes.applicationGuildCommands(auth.id, auth.guild), { body: [] })
//   .then(() => console.log('Successfully deleted all guild commands.'))
//   .catch(console.error);

// rest.get(Routes.applicationGuildCommands(auth.id))
//     .then(data => {
//         const promises = [];
//         for (const command of data) {
//             const deleteUrl = `${Routes.applicationGuildCommands(auth.id, auth.guild)}/${command.id}`;
//             promises.push(rest.delete(deleteUrl));
//         }
//         return Promise.all(promises);
//     });

// for global commands
// rest.put(Routes.applicationCommands(auth.id), { body: [] })
//   .then(() => console.log('Successfully deleted all application commands.'))
//   .catch(console.error);