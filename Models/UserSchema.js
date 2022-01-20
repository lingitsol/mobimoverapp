const mongo = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongo.Schema;
const User = new Schema({
    Name:{
        type:String,
        required:true,
    },
    Email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        // validate:["Emial must be valid"]

    },
    Phone:{
        type:Number,
        required:true,
        trim:true,
        minlength:10,

    },
    Password:{
        type:String,
        required:true,
        trim:true,
        minlength:8,
    },
    Confirm:{
        type:String,
        required:true,
        trim:true,
        minlength:8,
    },

},
    {
        timestamps:true,
    }
);

//for hashing the password before saving into database
User.pre("save", async function (next){
    const salt = await bcrypt.genSalt();
    //assign the hashing password to password field by this variable
    this.Password = await bcrypt.hash(this.Password,salt);
    next();
});

const client =mongo.model("user",User);

module.exports=client;
