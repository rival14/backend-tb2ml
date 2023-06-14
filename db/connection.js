const mongoose = require('mongoose');

const db = process.env.ATLAS_URI;

var _db;

module.exports = {
  connectToServer: function (callback) {
    mongoose.connect(db).then((err, db) => {
      if (db) {
        _db = db.db("chats");
        console.log("Successfully connected to MongoDB.");
      }
      return callback(err);
    });
  },

  getDb: function () {
    return _db;
  },
};