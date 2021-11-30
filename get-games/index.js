
// imports the database package - 'gives you the code to acccess the database'
// packages let you easily use other peoples codes. This will come with many functions you can use
// out of the box you have +, - .length, 

const MongoClient = require('mongodb').MongoClient;

// function to get our database -- used the same everytim you call the db
const loadDB = async () => {

  //envirnoment variables keep passwords safe from version control
  // this is stored in local.settings.json or in the configuration pane in azure functions
  let connectionString = process.env.cs

  // connect to the database mongo server
  const client = await MongoClient.connect(connectionString);

  //connect to the teameet database
  let db = client.db('teammeet');

  //return the connected database
  return db;
};

module.exports = async function(context, req) {
  //req contains all the info about the call
  //context.log(req)

  //req.query contains all the query parameters
  //context.log(req.query)

  //req.query.param gets an indivdual parameter
  //context.log(req.query.sport)
  

  try {
    // loadDB returns a MongoClient initialized to our database
    const database = await loadDB();

    //initalize an empty query, if no parameters used get all
    let query = {}

    // if sport is passes, use as filter
    if (req.query.sport)
      query.sport = req.query.sport

    // if sport is passes, use as filter
    if (req.query.location)
      query.location = req.query.location
    
    //print query object for us to look at
    context.log("the query passed to mongo is: " + JSON.stringify(query))

    let games = await database
      .collection('games')
      .find(query)
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
