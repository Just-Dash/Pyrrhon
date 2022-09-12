const fs = require('fs');
var cron = require('node-cron');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);

    const scheduledMessages = JSON.parse(fs.readFileSync('./info/scheduledMessages.json'));

    cron.schedule(`${scheduledMessages.messages.ffaAnnouncement.time}`, () => {
      if (!JSON.parse(fs.readFileSync('./info/scheduledMessages.json')).paused) {
        client.channels.cache.get(scheduledMessages.messages.ffaAnnouncement.channel).send(scheduledMessages.messages.ffaAnnouncement.content);
      }
    });

    cron.schedule(`${scheduledMessages.messages.ffaReminder.time}`, () => {
      if (!JSON.parse(fs.readFileSync('./info/scheduledMessages.json')).paused) {
        client.channels.cache.get(scheduledMessages.messages.ffaReminder.channel).send(scheduledMessages.messages.ffaReminder.content);
      }
    });

    cron.schedule(`${scheduledMessages.messages.lvdAnnouncement.time}`, () => {
      if (!JSON.parse(fs.readFileSync('./info/scheduledMessages.json')).paused) {
        client.channels.cache.get(scheduledMessages.messages.lvdAnnouncement.channel).send(scheduledMessages.messages.lvdAnnouncement.content);
      }
    });

    cron.schedule(`${scheduledMessages.messages.lvdReminder.time}`, () => {
      if (!JSON.parse(fs.readFileSync('./info/scheduledMessages.json')).paused) {
        client.channels.cache.get(scheduledMessages.messages.lvdReminder.channel).send(scheduledMessages.messages.lvdReminder.content);
      }
    });

    // for (message in scheduledMessages.messages) {
    //   cron.schedule(`${scheduledMessages.messages[message].time}`, () => {
    //     if (!scheduledMessages.paused) {
    //       client.channels.cache.get(scheduledMessages.messages[message].channel).send(scheduledMessages.messages[message].content);
    //     }
    //   });
    // }
  },
};