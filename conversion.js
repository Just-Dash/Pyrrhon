const auth = require('./info/auth.json');
const fs = require('fs');
const { neon } = require("@neondatabase/serverless");

const sql = neon(auth.db.url);

// Convert all users stored as .json into a PostgreSQL database
fs.readdir("./users", (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  files.forEach(async file => {
    let data = JSON.parse(fs.readFileSync(`./users/${file}`));
    await sql`INSERT INTO Users (id, points, fc) VALUES (${file.substring(0, file.length-5)}, ${data.points}, ${data.fc})`
  });
});