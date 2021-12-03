// imports the database package
const Mongo = require('../utils/mongo.js');



module.exports = async function(context, req) {
  //req contains all the info about the call
  //context.log(req)

  try {
    // loadDB returns a MongoClient initialized to our database
    const database = await Mongo.loadDB();

    if (!req.query.hasOwnProperty('game_id')){
      context.res = {
        status: 500,
        body: { message: 'No game_id in query' }
      }
      context.done()
      return
    }    
    
    //print query object for us to look at
    context.log("looking for: " + JSON.stringify(req.query.game_id))

    let reservations = await database
      .collection('reservations')
      .aggregate([
        {$match: {game_id: req.query.game_id}},
        {$lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'userinfo'
        }}
      ])
      .toArray()

    context.log(reservations)

    context.res = {
      body: { reservations: reservations }
    };

  } catch (error) {
    context.log(`Error code: ${error.code} message: ${error.message}`);
    context.res = {
      status: 500,
      body: { message: 'An error has occured, please try again later' }
    };
  }
};
