const mongoose=require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/schoolManagement');

const db=mongoose.connection;

db.once("open",(err)=>{
    err?console.log("Database is not connected",err):console.log("Database is connected successfully");
})
module.exports=db;