const MongoClient = require('mongodb').MongoClient;

let db = null;

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

exports.loadDB = loadDB;
