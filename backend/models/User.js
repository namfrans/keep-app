const noteSchema = require("./Note.js");

const userSchema = {
    googleId:String,
    Name:String,
    Lastname:String,
    email:String,
    profilePic:String,
    password:String,
    notes:{
        type:[noteSchema]
    }
};

module.exports = userSchema;