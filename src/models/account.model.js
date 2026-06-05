const mongoose = require('mongoose');
const ledgerModel = require("../models/ledger.model")
const userAccountSchema = new mongoose.Schema({
    userId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : [true, " User is required to create an account"]
    },

    status :{
        type : String,
        enum :{
            values : ["ACTIVE", "FROZEN", "CLOSED"],
            message : "Status must be either Active, Frozen or Closed"
        },
        default : 'ACTIVE'
    },

    Currency :{
        type : String,
        required : [ true , " Currency is required to create an account"],
        default : 'INR'
    },

    SystemUser:{
        type :  Boolean,
        default : false,
        select : false

    },

    createdAt:{
        type : Number,
        required : true
    },

    modifiedAt:{
        type : Number
    }
})

userAccountSchema.index({user : 1}, {status : 1})

userAccountSchema.methods.getBalance = async function () {
     
    const balanceData =await ledgerModel.aggregate([
        { $match : { accountId : this._id }},{
            $group :{
                _id:null,
                totalDebit :{
                    $sum:{
                        $cond:[
                              { $eq : [ "$type", "Debit"]},
                              "$amount",
                              0 
                        ]
                    }
                },

                totalCredit :{

                    $sum:{
                        $cond:[
                              { $eq : [ "$type", "Credit"]},
                              "$amount",
                              0 
                        ]
                    }
                }
            }
        },{
            $project:{
                _id : 0,
                balance :{
                    $subtract :["$totalCredit", "$totalDebit"] 
               }
            }
        }
    ])

    if(balanceData.length == 0){
        return 0
    }

    return balanceData[0].balance
}

module.exports = mongoose.model("UserAccount", userAccountSchema);