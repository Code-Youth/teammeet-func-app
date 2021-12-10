const Auth = require('./../utils/auth.js');
const Mongo = require('./../utils/mongo.js');


module.exports = async function(context, req) {

  let user = await Auth.getUser(req.body.id_token)

  try {
    context.log('JavaScript HTTP trigger function processed a request.');

    const database = await Mongo.loadDB();

    database.collection('users').update(
      { _id: user.id },
      {
          $set: {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            image: user.image,
            last_signed_in: new Date()
          },
          $setOnInsert: {
              created_at: new Date()
          }
      },
      { upsert: true }
    );

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: req.body,
        contentType: 'application/json'
    };
    } catch(err) {
        context.log(err)
        context.res = {
            status: 500
        };
    }
};
