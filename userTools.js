const sql = require('./db.js');

module.exports = {
  getUserData: async function (userID) {
    try {
      let data = await sql`SELECT * FROM getOrCreateUser(${userID})`;
      return data[0];
    }
    catch(err) {
      console.log(err);
    }
  },

  writeUserData: async function (userID, userData) {
    try {
      await sql`UPDATE Users SET points = ${userData.points}, fc = ${userData.fc} WHERE id = ${userID}`;
    }
    catch(err) {
      console.log(err);
    }
  }
};