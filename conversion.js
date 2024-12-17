const auth = require('./info/auth.json');
const fs = require('fs');
const { neon } = require("@neondatabase/serverless");

const sql = neon(auth.db.url);

// Convert all users stored as .json into a PostgreSQL database
fs.readdir("./users", async (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  let query = `INSERT INTO Users (id, points, fc) VALUES `;

  await files.forEach(async file => {
    let data = JSON.parse(fs.readFileSync(`./users/${file}`));
    query += `(${file.substring(0, file.length-5)}, ${parseInt(data.points)}, ${data.fc === undefined ? null : `\'${data.fc}\'`}),`;
    // await sql`INSERT INTO Users (id, points, fc) VALUES (${file.substring(0, file.length-5)}, ${data.points}, ${data.fc})`
  });

  await sql(query.substring(0, query.length-1));
});