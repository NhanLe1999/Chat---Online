//Được cấu hình trong server.js

import session from 'express-session';
import connectMongo from 'connect-mongo';

let MongoStore = connectMongo(session);

//Mongodb trong trường hợp này để lưu giữ sessionStore
let sessionStore = new MongoStore({
  url: `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  //url: `${process.env.MONGOLAB_URI}`,
  autoReconnect : true,
  //autoRemove: "native"
});

//Cấu hình sesion cho app
let config = (app) => {
  app.use(session({
    key: process.env.SESSION_KEY,
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 24 * 60 * 60 * 10
    }
  }));
};
module.exports = {
  config: config,
  sessionStore: sessionStore
};