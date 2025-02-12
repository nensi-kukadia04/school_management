const express=require('express');
const routes=express.Router();

const adminCtrl=require('../../../../controllers/api/v1/admin/adminCtrl');
const passport=require('passport');

//Admin Register
routes.post('/adminRegister',adminCtrl.adminRegister);

//Admin Login
routes.post('/adminLogin',adminCtrl.adminLogin);

//admin profile
routes.get('/adminProfile',passport.authenticate('jwt',{failureRedirect:'/api/adminFailLogin'}),adminCtrl.adminProfile);

//edit admin profile
routes.put('/editAdminProfile/:id',passport.authenticate('jwt',{failureRedirect:'/api/adminFailLogin'}),adminCtrl.editAdminProfile);

//admin logout
routes.get('/adminLogout',passport.authenticate('jwt',{failureRedirect:'/api/adminFailLogin'}),adminCtrl.adminLogout);

//change admin Password
routes.post('/changeAdminPassword',passport.authenticate('jwt',{failureRedirect:'/api/adminFailLogin'}),adminCtrl.changeAdminPassword);

//fail Login 
routes.get('/adminFailLogin',async(req,res)=>{
    try{
        res.status(200).json({msg:"Admin Failed Login.."});
    }
    catch(err){
        res.status(400).json({msg:"Something is wrong",error:err});
    }
})


module.exports=routes;