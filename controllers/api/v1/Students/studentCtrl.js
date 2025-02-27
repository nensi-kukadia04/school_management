const Student=require('../../../../models/Student/studentModels');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const nodemailer=require('nodemailer');

//Student login
module.exports.studentLogin=async(req,res)=>{
    try{
        let checkStudentEmail=await Student.findOne({email:req.body.email});
        if(checkStudentEmail){
            let checkPass=await bcrypt.compare(req.body.password,checkStudentEmail.password);
            if(checkPass){
                checkStudentEmail=checkStudentEmail.toObject()
                delete checkStudentEmail.password;
                let studentToken= await jwt.sign({FacultyData:checkStudentEmail},"Student",{expiresIn:"1d"});
                res.status(200).json({msg:"Student Login Successfully",studentToken:studentToken});
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
module.exports.seeStudentProfile=async(req,res)=>{
    try{
        res.status(200).json({msg:"Student Profile Data",Data:req.user});
    }
    catch(err){
        res.status(400).json({msg:"something is wrong",error:err});
    }
}

// edit profile
module.exports.editStudentProfile=async(req,res)=>{
    try{
        let editStudent=await Student.findById(req.params.id);
        if(editStudent){
            let updateStudentProfile=await Student.findByIdAndUpdate(req.params.id,req.body);
            if(updateStudentProfile){
                let updateProfile=await Student.findById(req.params.id);
                res.status(200).json({msg:"Student Updated successfully",updateProfile}); 
            }
            else{
                res.status(200).json({msg:"Student Not Updated"}); 
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
module.exports.studentLogout=async(req,res)=>{
    try{
        req.session.destroy((err)=>{
            if(err){
                res.status(200).json({msg:"something is wrong.."});
            }
            else{
                res.status(200).json({msg:"Student Logout successfully.."});
            }
        })
    }
    catch(err){
        res.status(400).json({msg:"something is wrong..",error:err});
    }
}

//change faculty Password
module.exports.changeStudentPassword=async(req,res)=>{
    try{
        let checkStudentPassword=await bcrypt.compare(req.body.currentPass,req.user.password);
        if(checkStudentPassword){
            if(req.body.newPassword!=req.body.currentPass){
                if(req.body.newPassword==req.body.confirmPassword){
                    req.body.password=await bcrypt.hash(req.body.newPassword,10);
                    let updatePassword=await Student.findByIdAndUpdate(req.user._id,req.body);
                    if(updatePassword){
                        let updateStudentPassword=await Student.findById(req.user._id);
                        res.status(200).json({msg:"password Updated successfully",updateStudentPassword});
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
module.exports.sendStudentEmail=async(req,res)=>{
    try{
        let checkEmail=await Student.findOne({email:req.body.email});
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
module.exports.forgetStudentPassword=async(req,res)=>{
    try{
        console.log(req.body);
        let checkEmail=await Student.findOne({email:req.body.email});
        if(checkEmail){
            if(req.body.newPassword==req.body.confirmPassword){
                req.body.password=await bcrypt.hash(req.body.newPassword,10);
                let updateStudentPassword=await Student.findByIdAndUpdate(checkEmail._id,req.body);
                if(updateStudentPassword){
                    res.status(200).json({msg:"password updated successfully",data:updateStudentPassword});
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
