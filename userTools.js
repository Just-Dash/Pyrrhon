const fs = require('fs');

function register(userID) {
  const filepath = `./users/${userID}.json`;
  const weapons = JSON.parse(fs.readFileSync('./info/weapons.json'));
  let userData = {
    points: 0,
    weapons,
  };
  fs.writeFileSync(filepath, JSON.stringify(userData, null, 2));
  return userData;
}

module.exports = {
  getUserData: function (userID) {
    const filepath = `./users/${userID}.json`;
    if (fs.existsSync(filepath)) {
      return JSON.parse(fs.readFileSync(filepath));
    }
    else {
      return register(userID);
    }
  },

  writeUserData: function (userID, userData) {
    const filepath = `./users/${userID}.json`;
    try {
      if (!userData) return;
      fs.writeFileSync(filepath, JSON.stringify(userData, null, 2));
    }
    catch (err) {
      console.log(err);
    };
  }
};