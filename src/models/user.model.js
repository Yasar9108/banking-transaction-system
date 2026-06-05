const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
    
    gmail:{
        type:String,
        required: [true, "Gmail is Required to create a user"],
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, "Please fill a valid email address"],
        unique: true
    },

    name:{
        type: String,
        rerquired: [true, "Name is Required to create a user"]
    },

    password:{
        type: String,
        required: [ true, "Password is Required to create a user"],
        minlength: [6, "Password must be at least 6 characters long"],
        select : false
    },

    timeStamp:{
        type: Number,
        required: true
    }

})

userSchema.pre("save", async function(){

    if(!this.isModified("password")){
        return;
    }

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    return;

})

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

const UserModel = mongoose.model("UserModel", userSchema);
module.exports = UserModel;

