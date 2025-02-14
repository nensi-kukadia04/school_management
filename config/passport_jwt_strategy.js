const passport=require('passport');
const jwtStrategy=require('passport-jwt').Strategy;
const ejwt=require('passport-jwt').ExtractJwt;

var opts={
    jwtFromRequest:ejwt.fromAuthHeaderAsBearerToken(),
    secretOrKey:"Api"
}

const Admin=require('../models/admin/adminModel');

passport.use(new jwtStrategy(opts, async function(payload,done){
    let checkUserData=await Admin.findOne({email:payload.AdminData.email});
    if(checkUserData){
        return done(null,checkUserData);
    }else{
        return done(null,false)
    }
}))

const FacultyModel=require('../models/faculty/FacultyModel');
var facultyOpts={
    jwtFromRequest:ejwt.fromAuthHeaderAsBearerToken(),
    secretOrKey:"Faculty"
}

passport.use('faculty',new jwtStrategy(facultyOpts, async function(payload,done){
    let checkFacultyData=await FacultyModel.findOne({email:payload.FacultyData.email});
    if(checkFacultyData){
        return done(null,checkFacultyData);
    }else{
        return done(null,false)
    }
}))

passport.serializeUser((user,done)=>{
    return done(null,user.id);
})

passport.deserializeUser(async(id,done)=>{
    let userdata = await Admin.findById(id);
    if(userdata){
        return done(null,userdata);
    }
    else{
        return done(null,false);
    }
})

module.exports=passport;