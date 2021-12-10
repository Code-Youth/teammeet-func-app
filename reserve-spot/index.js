
// imports the database package - 'gives you the code to acccess the database'
// packages let you easily use other peoples codes. This will come with many functions you can use
// out of the box you have +, - .length, 

const Auth = require('./../utils/auth.js');
const Mongo = require('./../utils/mongo.js');
const ObjectId = require('mongodb').ObjectId


module.exports = async function(context, req) {

  if (!req.body.hasOwnProperty('id_token')){
    context.res = {
      status: 500,
      body: { message: 'No id_token in body' }
    }
    context.done()
    return
  }    

  if (!req.body.hasOwnProperty('game_id')){
    context.res = {
      status: 500,
      body: { message: 'No game_id in body' }
    }
    context.done()
    return
  }
  
  let game_id = req.body.game_id
  let user = await Auth.getUser(req.body.id_token)
  
  let database = await Mongo.loadDB()
  let game = await database.collection('games').findOne({ "_id" : new ObjectId(game_id)})

  if (!game){
    context.res = {
      status: 500,
      body: { message: "game doesn't exist" }
    }
    context.done()
    return
  }

  if (game.numPlayers < 1){
    context.res = {
      status: 500,
      body: { message: "no spots left" }
    }
    context.done()
    return
  }

  await database.collection('reservations').update(
    { game_id: game_id, user_id: user.id },
    {
        $set: {
          going: true,
          last_updated: new Date()
        },
        $setOnInsert: {
            created_at: new Date()
        }
    },
    { upsert: true }
  ); 

  await database.collection('games').update(
    { "_id" : game_id},
    { "$inc": { "numPlayers": -1 } }
  );
};
