const express=require('express');
const routes=express.Router();
const passport=require('passport');

const facultyCtrl=require('../../../../controllers/api/v1/Faculty/facultyCtrl');

//faculty login
routes.post('/facultyLogin',facultyCtrl.facultyLogin);

//faculty profile
routes.get('/facultyProfile',passport.authenticate('faculty',{failureRedirect:'/api/faculty/failFacultyAuth'}),facultyCtrl.facultyProfile);

//faculty profile edit
routes.post('/editFacultyProfile/:id',passport.authenticate('faculty',{failureRedirect:'/api/faculty/failFacultyAuth'}),facultyCtrl.editFacultyProfile);

//faculty logout
routes.get('/facultyLogout',passport.authenticate('faculty',{failureRedirect:'/api/faculty/failFacultyAuth'}),facultyCtrl.facultyLogout);

//Unauthorized
routes.get('/failFacultyAuth',async(req,res)=>{
    try{
        res.status(200).json({msg:"Invalid Token"});
    }
    catch{
        res.status(400).json({msg:"something is wrong..",error:err});
    }
})

module.exports=routes;