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
        console.log("params id",req.params.id);
        console.log("req body",req.body);
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
