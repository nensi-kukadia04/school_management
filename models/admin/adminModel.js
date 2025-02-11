const mongoose=require('mongoose');

const AdminSchema=mongoose.Schema({
    userName:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    status:{
        type:Boolean,
        default:true
    }
},
    {timestamps:true}
)

const Admin = mongoose.model('Admin',AdminSchema);
module.exports=Admin;