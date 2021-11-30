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


module.exports = async function (context, req) {

  try {
      context.log('JavaScript HTTP trigger function processed a request.');

      const database = await loadDB();

      database.collection('games').insertOne(req.body)

      context.res = {
          // status: 200, /* Defaults to 200 */
          body: req.body,
          contentType: 'application/json'
      };
  } catch(err) {
      context.res = {
          status: 500
      };
  }
}
