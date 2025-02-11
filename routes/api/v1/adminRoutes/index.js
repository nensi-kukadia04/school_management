const express=require('express');
const routes=express.Router();

const adminCtrl=require('../../../../controllers/api/v1/admin/adminCtrl');

//Admin Register
routes.post('/adminRegister',adminCtrl.adminRegister);

//Admin Login
routes.post('/adminLogin',adminCtrl.adminLogin);

module.exports=routes;