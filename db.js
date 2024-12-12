const auth = require('./info/auth.json');
const { neon } = require("@neondatabase/serverless");

sql = neon(auth.db.url);

// Creates database functions for later use
async function createDbFunctions() {
  // If user exists, return their data, otherwise make new user and return that
  await sql`
    CREATE OR REPLACE FUNCTION getOrCreateUser(userID VARCHAR)
    RETURNS Users AS $$
    DECLARE
    userRecord Users;
    BEGIN
    SELECT * INTO userRecord FROM Users WHERE id = userID;

    IF NOT FOUND THEN
        INSERT INTO Users (id, points) VALUES (userID, 0) RETURNING * INTO userRecord;
    END IF;

    RETURN userRecord;
    END;
    $$ LANGUAGE plpgsql;`;
}

createDbFunctions();

module.exports = sql;