// imports the database package
const Mongo = require('./../utils/mongo.js');



module.exports = async function(context, req) {
  //req contains all the info about the call
  //context.log(req)

  try {
    // loadDB returns a MongoClient initialized to our database
    const database = await Mongo.loadDB();

    //initalize an empty query, if no parameters used get all
    let query = {}

    // if sport is passes, use as filter
    if (req.query.sport)
      query.sport = req.query.sport

    // if sport is passes, use as filter
    if (req.query.location)
      query.location = req.query.location

    // if sport is passes, use as filter
    if (req.query._id)
      query._id = req.query._id
    
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
