const Faculty = require('../../../../models/faculty/FacultyModel');
const Student=require('../../../../models/Student/studentModels');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const nodemailer=require('nodemailer');

//faculty login
module.exports.facultyLogin=async(req,res)=>{
    try{
        let checkFacultyEmail=await Faculty.findOne({email:req.body.email});
        if(checkFacultyEmail){
            let checkPass=await bcrypt.compare(req.body.password,checkFacultyEmail.password);
            if(checkPass){
                checkFacultyEmail=checkFacultyEmail.toObject()
                delete checkFacultyEmail.password;
                let facultyToken= await jwt.sign({FacultyData:checkFacultyEmail},"Faculty",{expiresIn:"1d"});
                res.status(200).json({msg:"Faculty Login Successfully",facultyToken:facultyToken});
            }
            else{
                res.status(200).json({msg:"Invalid Password"});
            }
        }
        else{
            res.status(200).json({msg:"Invalid Email"});
        }
    }
    catch(err){
        console.log(err);
        res.status(400).json({msg:"something is wrong",error:err});
    }
}

//faculty profile
module.exports.facultyProfile=async(req,res)=>{
    try{
        res.status(200).json({msg:"Profile Data",Data:req.user});
    }
    catch(err){
        res.status(400).json({msg:"something is wrong",error:err});
    }
}

// edit profile
module.exports.editFacultyProfile=async(req,res)=>{
    try{
        let editFaculty=await Faculty.findById(req.params.id);
        if(editFaculty){
            let updateFacultyProfile=await Faculty.findByIdAndUpdate(req.params.id,req.body);
            if(updateFacultyProfile){
                let updateProfile=await Faculty.findById(req.params.id);
                res.status(200).json({msg:"Faculty Updated successfully",updateProfile}); 
            }
            else{
                res.status(200).json({msg:"Faculty Not Updated"}); 
            }
        }
        else{
            res.status(200).json({msg:"Invalid email"});
        }
    }
    catch(err){

    }
}

//faculty Logout
module.exports.facultyLogout=async(req,res)=>{
    try{
        req.session.destroy((err)=>{
            if(err){
                res.status(200).json({msg:"something is wrong.."});
            }
            else{
                res.status(200).json({msg:"Faculty Logout successfully.."});
            }
        })
    }
    catch(err){
        res.status(400).json({msg:"something is wrong..",error:err});
    }
}

//change faculty Password
module.exports.changeFacultyPassword=async(req,res)=>{
    try{
        let checkFacultyPassword=await bcrypt.compare(req.body.currentPass,req.user.password);
        if(checkFacultyPassword){
            if(req.body.newPassword!=req.body.currentPass){
                if(req.body.newPassword==req.body.confirmPassword){
                    req.body.password=await bcrypt.hash(req.body.newPassword,10);
                    let updatePassword=await Faculty.findByIdAndUpdate(req.user._id,req.body);
                    if(updatePassword){
                        let updateFacultyPassword=await Faculty.findById(req.user._id);
                        res.status(200).json({msg:"password Updated successfully",updateFacultyPassword});
                    }else{
                        res.status(200).json({msg:"Password not updated"});
                    }
                }
                else{
                    res.status(200).json({msg:"new Password and confirm password not matched"});
                }
            }
            else{
                res.status(200).json({msg:"current password and new password are same...Try Again"});
            }
        }
        else{
            res.status(200).json({msg:"current password not matched.."});
        }
    }
    catch(err){
        res.status(400).json({msg:"something is wrong..",error:err});
    }
}

//forget password
module.exports.sendFacultyEmail=async(req,res)=>{
    try{
        let checkEmail=await Faculty.findOne({email:req.body.email});
        if(checkEmail){
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for port 465, false for other ports
                auth: {
                  user: "kukadiyanensi41@gmail.com",
                  pass: "pvrsvtypfeurzwwj",
                },
                tls:{
                    rejectUnauthorized:false
                }
            });

            let otp=Math.round(Math.random()*1000000);

            const info = await transporter.sendMail({
                from: 'kukadiyanensi41@gmail.com', // sender address
                to: req.body.email, // list of receivers
                subject: "OTP Verification", // Subject line
                text: "forget password", // plain text body
                html: `<b>Otp:${otp}</b>`, // html body
            });

            let data={
                email:req.body.email,otp
            }
            if(info){
                res.status(200).json({msg:"send Mail..please check your mail"});
            }else{
                res.status(200).json({msg:"mail not sent",data:info});
            }
        }
        else{
            res.status(200).json({msg:"Invalid Email"});
        }
    }
    catch(err){
        res.status(400).json({msg:"something is wrong..",error:err});
    }
}
module.exports.forgetFacultyPassword=async(req,res)=>{
    try{
        console.log(req.body);
        let checkEmail=await Faculty.findOne({email:req.body.email});
        if(checkEmail){
            if(req.body.newPassword==req.body.confirmPassword){
                req.body.password=await bcrypt.hash(req.body.newPassword,10);
                let updateFacultyPassword=await Faculty.findByIdAndUpdate(checkEmail._id,req.body);
                if(updateFacultyPassword){
                    res.status(200).json({msg:"password updated successfully",data:updateFacultyPassword});
                }
                else{
                    res.status(200).json({msg:"Password not updated"});
                }
            }
            else{
                res.status(200).json({msg:"new Password and confirm password not matched"});
            }
        }
        else{
            res.status(200).json({msg:"Invalid Email"}); 
        }
    }
    catch(err){
        res.status(400).json({msg:"something is wrong..",error:err}); 
    }
}

//student Registration
module.exports.studentRegister=async(req,res)=>{
    try{
        let existEmail=await Student.findOne({email:req.body.email});
        if(!existEmail){
            var gPass=generatePassword();
            var link="http://localhost:9000/api";
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for port 465, false for other ports
                auth: {
                  user: "kukadiyanensi41@gmail.com",
                  pass: "pvrsvtypfeurzwwj",
                },
                tls:{
                    rejectUnauthorized:false
                }
            });

            const info = await transporter.sendMail({
                from: 'kukadiyanensi41@gmail.com', // sender address
                to: req.body.email, // list of receivers
                subject: "Student Login Information", // Subject line
                text: "Student Login", // plain text body
                html: `<h1>Faculty Verification</h1><p>email:${req.body.email}</p><p>password:${gPass}</p><p>To Get Login Click here:${link}</p>`, // html body
            });
            
            if(info){
                let bcryptGPass=await bcrypt.hash(gPass,10);
                let addStudent=await Student.create({email:req.body.email,password:bcryptGPass,userName:req.body.userName});
                if(addStudent){
                    res.status(200).json({msg:"Student add successfully",data:addStudent});
                }else{
                    res.status(200).json({msg:"Student not add"});
                }
            }else{
                res.status(200).json({msg:"Mail not Sent"});
            }
        }
        else{
            res.status(200).json({msg:"Invalid Email"});
        }
    }
    catch(err){
        console.log(err);
        res.status(400).json({msg:"something is wrong..",error:err});
    }
}

//password generator
function generatePassword() {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}