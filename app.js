const express= require('express');
const port=9000;
const app=express();
const passport = require("passport");
const jwtPassport = require("./config/passport_jwt_strategy");
const session = require("express-session");
// const db=require('./config/db');
const mongoose=require('mongoose');
mongoose.connect(
      "mongodb+srv://kukadiyanensi838:HSDmIm2lmEgtkfVa@cluster0.j60zp.mongodb.net/API").then((res) => {
          console.log("Database is Online Connected");
      })
      .catch((err) => {
          console.log("Database is not Connected",err);
      });

app.use(express.urlencoded());
app.use(session({
    name: "jwtSession",
    secret: "jwtJJ",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 100 * 60 * 60,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api',require('./routes/api/v1/adminRoutes'));

app.listen(port,(err)=>{
    err?console.log("Error is",err):console.log("Server is running on port http://localhost:"+port);
})