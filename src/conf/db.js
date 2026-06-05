const mongoose = require("mongoose");

function connectDb(){
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log(" Server is connceted to DataBase")
    }).catch(err=>{
        console.log(" Error in connceting server to DataBase", err)
        process.exit(1);
    })
}

module.exports = connectDb;