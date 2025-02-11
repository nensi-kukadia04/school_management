const express= require('express');
const port=9000;
const app=express();
const db=require('./config/db');

app.use(express.urlencoded());
app.use('/api',require('./routes/api/v1/adminRoutes'));

app.listen(port,(err)=>{
    err?console.log("Error is",err):console.log("Server is running on port http://localhost:"+port);
})