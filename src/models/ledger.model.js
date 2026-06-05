const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema({
    accountId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "UserAccount",
        required : [true, " Account is required to create a ledger entry"],
        index : true,
        immutable : true
    },

    amount : {
        type : Number,
        required : [true, " Amount is required to create a ledger entry"],
        min : [0, " Amount must be a positive number"],
        immutable : true
    },

    type :{
        type : String,
        enum :{
            values : ["Credit", 'Debit'],
            message : " Type must be credit or debit"
        },
        required : [ true],
        immutable : true
    },

    transactionId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Transaction",
        required : [true, " Transaction is required to create a ledger entry"],
        index : true,
        immutable : true
    },

    timeStamp:{
        type:Number
    }
})

function preventLedgerModification(){
    throw new Error("Ledger entries cannot be modified or deleted");
}

ledgerSchema.pre("findOneAndDelete", preventLedgerModification);
ledgerSchema.pre("findOneAndUpdate", preventLedgerModification);
ledgerSchema.pre("updateOne", preventLedgerModification);
ledgerSchema.pre("deleteOne", preventLedgerModification);
ledgerSchema.pre("deleteMany", preventLedgerModification);

const LedgerModel = mongoose.model("Ledger", ledgerSchema);
module.exports = LedgerModel;