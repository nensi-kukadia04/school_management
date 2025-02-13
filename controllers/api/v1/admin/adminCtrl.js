const Admin=require('../../../../models/admin/adminModel');
const Faculty=require('../../../../models/faculty/FacultyModel');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const nodemailer=require('nodemailer');

//Admin Register
module.exports.adminRegister=async(req,res)=>{
    try{
        let adminEmailExist=await Admin.findOne({email:req.body.email});
        if(!adminEmailExist){
            if(req.body.password==req.body.confirmPassword){
                req.body.password=await bcrypt.hash(req.body.password,10);
                let AdminData = await Admin.create(req.body);
                if(AdminData){
                    res.status(200).json({msg:"Admin Record Created",AdminData:AdminData});
                }   
                else{
                    res.status(200).json({msg:"Admin record not create"});
                } 
            }
            else{
                res.status(200).json({msg:"Password & confirm password doesn't match...Try Again"});
            }
        }
        else{
            res.status(200).json({msg:"Email Already Exist"});
        }
    }
    catch(err){
        res.status(400).json({msg:"Something is wrong...",error:err});
    }
}

//Admin Login
module.exports.adminLogin=async(req,res)=>{
    try{
        let checkAdmin=await Admin.findOne({email:req.body.email});
        if(checkAdmin){
            let checkPassword= await bcrypt.compare(req.body.password,checkAdmin.password);
            if(checkPassword){
                checkAdmin=checkAdmin.toObject()
                delete checkAdmin.password;
                let adminToken= await jwt.sign({AdminData:checkAdmin},"Api",{expiresIn:"1d"});
                res.status(200).json({msg:"Admin Login Successfully",adminToken:adminToken});
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
        res.status(400).json({msg:"Something is wrong",error:err});
    }
}

//profile
module.exports.adminProfile=async(req,res)=>{
    try{
        res.status(200).json({msg:"Admin Profile",data:req.user});
    }catch(err){
        res.status(400).json({msg:"Something is wrong",error:err});
    }
}

//edit profile
module.exports.editAdminProfile=async(req,res)=>{
    try{
        let checkAdminId=await Admin.findById(req.params.id);
        if(checkAdminId){
            let updateAdminProfile=await Admin.findByIdAndUpdate(req.params.id,req.body);
            if(updateAdminProfile){
                let updateProfile=await Admin.findById(req.params.id);
                res.status(200).json({msg:"Admin Updated successfully",updateProfile}); 
            }
            else{
                res.status(200).json({msg:"Admin Not Updated"}); 
            }
        }else{
            res.status(200).json({msg:"Invalid email"});
        }
    }
    catch(err){
        res.status(400).json({msg:"something is wrong..",error:err});
    }
}

//admin Logout
module.exports.adminLogout=async(req,res)=>{
    try{
        req.session.destroy((err)=>{
            if(err){
                res.status(200).json({msg:"something is wrong.."});
            }
            else{
                res.status(200).json({msg:"Admin Logout successfully.."});
            }
        })
    }
    catch(err){
        res.status(400).json({msg:"something is wrong..",error:err});
    }
}

//change password
module.exports.changeAdminPassword=async(req,res)=>{
    try{
        let checkAdminPassword=await bcrypt.compare(req.body.currentPass,req.user.password);
        if(checkAdminPassword){
            if(req.body.newPassword!=req.body.currentPass){
                if(req.body.newPassword==req.body.confirmPassword){
                    req.body.password=await bcrypt.hash(req.body.newPassword,10);
                    let updatePassword=await Admin.findByIdAndUpdate(req.user._id,req.body);
                    if(updatePassword){
                        let updateAdminPassword=await Admin.findById(req.user._id);
                        res.status(200).json({msg:"password Updated successfully",updateAdminPassword});
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
        console.log(err);
        
        res.status(400).json({msg:"something is wrong..",error:err});
    }
}

//forget password
module.exports.sendEmail=async(req,res)=>{
    try{
        let checkEmail=await Admin.findOne({email:req.body.email});
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
                res.status(200).json({msg:"send Mail..please check your mail",data:data});
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

module.exports.forgetPassword=async(req,res)=>{
    try{
        let checkEmail=await Admin.findOne({email:req.query.email});
        if(checkEmail){
            if(req.body.newPass==req.body.confirmPass){
                req.body.password=await bcrypt.hash(req.body.newPass,10);
                let updatePassword=await Admin.findByIdAndUpdate(checkEmail._id,req.body);
                if(updatePassword){
                    res.status(200).json({msg:"password updated successfully",data:updatePassword});
                }
                else{
                    res.status(200).json({msg:"Password not updated"});
                }
            }
            else{
                res.status(200).json({msg:"new Password and confirm password not matched"});
            }
        }else{
            res.status(200).json({msg:"Invalid Email"});
        }
    }
    catch(err){
        res.status(400).json({msg:"something is wrong..",error:err});
    }
}

//faculty Registration
module.exports.facultyRegister=async(req,res)=>{
    try{
        let existEmail=await Faculty.findOne({email:req.body.email});
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
                subject: "Faculty Verification", // Subject line
                text: "Faculty Login", // plain text body
                html: `<h1>Faculty Verification</h1><p>email:${req.body.email}</p><p>password:${gPass}</p><p>To Get Login Click here:${link}</p>`, // html body
            });
            
            if(info){
                let addFaculty=await Faculty.create({email:req.body.email,password:gPass,userName:req.body.userName});
                if(addFaculty){
                    res.status(200).json({msg:"Faculty add successfully",data:addFaculty});
                }else{
                    res.status(200).json({msg:"Faculty not add"});
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