const { MongoClient } = require('mongodb')

let dbConnection

module.exports = {
  connectToDb: (cb) => {
    // MongoClient.connect(process.env.MONGO_LOCAL_URI + "/" + process.env.DATABASE_NAME)
    MongoClient.connect(process.env.MONGO_ATLAS_URI_USER_VICTOR)
      .then(client => {
        dbConnection = client.db()
        return cb() 
      })
      .catch(err => {
        console.log(err)
        return cb(err)
      })
  },
  getDb: () => dbConnection,  
  getDbMiddleware: (req, res, next) => {
    req.db = dbConnection;
    next();
  }
}