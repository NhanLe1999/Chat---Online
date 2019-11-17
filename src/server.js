import express from "express";
import connectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRoutes from "./routes/web";
import bodyParser from "body-parser";//Thư viện này dùng để lấy dữ liệu gửi lên server
import conectFlash from "connect-flash";// thư viện này hỗ trợ việc gửi thông báo về cho người dùng
import session from "./config/session";
import configSocketIo from "./config/socketio";
import passport from "passport";

import http from "http";
import socketio from "socket.io";
import initSockets from "./sockets/index";
import passpportSocketIo from "passport.socketio";
import cookieParser from "cookie-parser";
import events from "events";
import * as configApp from "./config/app";

//Init app Khởi tạo app
let app = express();
events.EventEmitter.defaultMaxListeners = configApp.app.max_event_listeners;
//Khởi tạo server bằng việc kết hợp thư viện soket.io và express app
let server = http.createServer(app);
let io = socketio(server);

//Connect to mongodb
connectDB();

//config session
session.config(app);

//config view Engine Cấu hình view engine
configViewEngine(app);

//Enable post data request server
app.use(bodyParser.urlencoded({ extended: true }));

//Enable flash messages
app.use(conectFlash());
//Sử dụng thư viện cookiePater
app.use(cookieParser());

//config passprot
app.use(passport.initialize());
app.use(passport.session());// Lấy các dữ liệu của session

//init all routers
initRoutes(app);

//Lấy dữ lieueh từ trong csdl 
io.use(passpportSocketIo.authorize({
  cookieParser: cookieParser,
  key: process.env.SESSION_KEY,
  secret: process.env.SESSION_SECRET,
  store: session.sessionStore,
  success: (data, accept) => {
    if(!data.user.logged_in) {
      return accept("Invalid user.", false);
    }
    return accept(null, true);
  },
  fail: (data, message, error, accept) => {
    if(error) {
      console.log("failed connection", message);
      return accept(new Error(message), false);
    }
  }
}));
//init all socket
initSockets(io);



server.listen(process.env.APP_PORT , process.env.APP_HOST, () => { 
  console.log(`Hello Nhan Le, I"m running at ${process.env.APP_HOST}:${process.env.APP_PORT}/`); 
});

/*
//Cấu hình giao thức https
import pem from "pem";
 import https from "https";
 pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
     if (err) {
       throw err;
     }
     let app = express();

//     //connect to mongodb
    connectDB(); 
    
     //config session
     session.config(app);
     
     //config view engine
    
     configViewEngine(app);
    
     //Enable post view engine
     app.use(bodyParser.urlencoded({extended: true}));
    
     //Enable flash message
     app.use(conectFlash());
    
     //config passport js
     app.use(passport.initialize());
     app.use(passport.session());
    
     //Init all routes
     initRoutes(app);
    
  
     https.createServer({ key: keys.serviceKey, cert: keys.certificate }, app).listen(process.env.APP_PORT , process.env.APP_HOST, () => { 
         console.log(`Hello Nhan Le, I"m running at https://${process.env.APP_HOST}:${process.env.APP_PORT}/`); 
     }); 
    })*/
