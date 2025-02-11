const Admin=require('../../../../models/admin/adminModel');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

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
        res.status(200).json({msg:"Something is wrong",error:err});
    }
}
