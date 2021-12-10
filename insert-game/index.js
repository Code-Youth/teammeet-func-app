const Mongo = require('./../utils/mongo.js');

module.exports = async function (context, req) {

  try {
      context.log('JavaScript HTTP trigger function processed a request.');

      const database = await Mongo.loadDB();

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
