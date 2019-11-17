import mongoose from "mongoose";
import bluebird from "bluebird";
require('dotenv').config();

//kết nối mongodb
//
//  DB_CONNECTION=mongodb
// DB_HOST=localhost
//  DB_PORT=27017
//  DB_NAME=chat_online

let connectDB = () => {
  mongoose.Promise = bluebird;

  let URI = `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
  //let URI = `${process.env.MONGOLAB_URI}`;
  return mongoose.connect(URI, { useMongoClient: true });
}
module.exports = connectDB;