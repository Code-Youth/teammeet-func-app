const MongoClient = require('mongodb').MongoClient;

let db = null;
const loadDB = async () => {
  if (db) {
    return db;
  }
  const client = await MongoClient.connect(process.env.cs);

  db = client.db('teammeet');
  return db;
};

module.exports = async function(context) {
  try {
    const database = await loadDB();
    let games = await database
      .collection('games')
      .find()
      .toArray()

    context.res = {
      body: { games: games }
    };

  } catch (error) {
    context.log(`Error code: ${error.code} message: ${error.message}`);
    context.res = {
      status: 500,
      body: { message: 'An error has occured, please try again later' }
    };
  }
};
