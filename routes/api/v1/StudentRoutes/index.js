const express=require('express');
const routes=express.Router();
const passport=require('passport');

const studentCtrl=require('../../../../controllers/api/v1/Students/studentCtrl');

//student login
routes.post('/studentLogin',studentCtrl.studentLogin);

//student profile 
routes.get('/seeStudentProfile',studentCtrl.seeStudentProfile);

//faculty profile edit
routes.post('/editStudentProfile/:id',passport.authenticate('student',{failureRedirect:'/api/student/failStudentAuth'}),studentCtrl.editStudentProfile);

//faculty logout
routes.get('/studentLogout',passport.authenticate('student',{failureRedirect:'/api/student/failStudentAuth'}),studentCtrl.studentLogout);

//change password
routes.post('/changeStudentPassword',passport.authenticate('student',{failureRedirect:'/api/student/failStudentAuth'}),studentCtrl.changeStudentPassword);

//forgetPassword
routes.post('/sendStudentEmail',studentCtrl.sendStudentEmail);
routes.post('/forgetStudentPassword',studentCtrl.forgetStudentPassword);

//Unauthorized
routes.get('/failStudentAuth',async(req,res)=>{
    try{
        res.status(200).json({msg:"Invalid Token"});
    }
    catch{
        res.status(400).json({msg:"something is wrong..",error:err});
    }
})

module.exports=routes;