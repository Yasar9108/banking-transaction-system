const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    senderAccountId :{
        type: mongoose.Schema.ObjectId,
        ref : "UserAccount",
        required : [true, " From Account is required to create a transaction"]
    },

    receiverAccountId :{
        type : mongoose.Schema.ObjectId,
        ref : "UserAccount",
        required : [true, " To Account is required to create a transaction"]
    },

    amount :{
        type : Number,
        required : [true, " Amoount is required to create a transaction"],
        min : [0, " Amount must be a positive number"]
    },

    status :{
        type : String,
        enum :{
            values : ['Pending', 'Completed', 'Failed', 'Reversed'],
            message : " Status must be either pending, completed, failed or reversed"
        },
        default : 'Pending'
    },

    idempotencykey :{
        type : String,
        required : true,
        unique : true,
        index : true
    },

    timeStamp:{
        type : Number
    }
})

module.exports = mongoose.model("Transaction", transactionSchema);