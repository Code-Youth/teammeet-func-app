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

      // Read incoming data
      const name = (req.query.name || (req.body && req.body.name));
      const sport = (req.query.sport || (req.body && req.body.sport));

      // fail if incoming data is required
      if (!name || !sport) {
          context.res = {
              status: 400
          };
          return;
      }

      const message = `${name} likes ${sport}`;

      // Construct response
      const gameJson = {
          "name": name,
          "sport": sport,
          "message": message,
          "success": true
      }

      const database = await loadDB();

      database.collection('games').insertOne(req.body)

      context.res = {
          // status: 200, /* Defaults to 200 */
          body: responseJSON,
          contentType: 'application/json'
      };
  } catch(err) {
      context.res = {
          status: 500
      };
  }
}
