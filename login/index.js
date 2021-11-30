const jwt_decode = require('jwt-decode');
const {OAuth2Client} = require('google-auth-library');
const MongoClient = require('mongodb').MongoClient;

async function getUser(token) {
  let CLIENT_ID = process.env.CLIENT_ID
  
  const client = new OAuth2Client(CLIENT_ID);
  
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID
  });
  
  const response = ticket.getPayload();

  if (response.iss !== 'accounts.google.com' && response.aud !== CLIENT_ID)
    return res.status(400).json({ status: 'error', error: 'Bad Request' });

  const user = {
    id: response.sub,
    email: response.email,
    image: response.picture,
    first_name: response.given_name,
    last_name: response.family_name,
  };

  return user
}

let db = null;
const loadDB = async () => {
  if (db) {
    return db;
  }
  const client = await MongoClient.connect(process.env.cs);

  db = client.db('teammeet');
  return db;
};

module.exports = async function(context, req) {

  let user = await getUser(req.body.id_token)

  try {
    context.log('JavaScript HTTP trigger function processed a request.');

    const database = await loadDB();

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
