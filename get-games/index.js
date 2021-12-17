
// imports the database package
const Mongo = require('./../utils/mongo.js');



module.exports = async function(context, req) {
  //req contains all the info about the call
  //context.log(req)
  context.log(req)
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

      if(req.query.numPlayers){
        query.numPlayers = parseInt(req.query.numPlayers)
      context.log(query)
      }
      if(req.query.startDate && req.query.endDate){
        let startDate = new Date(req.query.startDate)
        let endDate = new Date(req.query.endDate)
        query.date = {$gte:startDate,$lte:endDate}
      }
// ?startDate=yyyy-mm-dd&endDate=yyyy-mm-dd
     else if(req.query.startDate){
        let startDate=new Date(req.query.startDate)
       query.date = {$gte:startDate}
      }
//  ?startDate=yyyy-mm-dd
      else if(req.query.endDate){
        let endDate=new Date(req.query.endDate)
       query.date = {$lte:endDate}
      }

      if(req.query.sklLevel)
      query.sklLevel= req.query.sklLevel
//  ?endDate=yyyy-mm-dd
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
