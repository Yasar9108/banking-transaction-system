const accountModel = require("../models/account.model");
const UserModel = require("../models/user.model");
const emailService = require('../service/gmail.service')

async function createAccountController(req, res) {
  console.debug(" -->" + " Entered into createAccountController post method :  " + Date.now());
  try {
    var JSONOBJ = new Object();
    JSONOBJ.userId = req.user._id;
    JSONOBJ.createdAt = Date.now();
    const account = new accountModel(JSONOBJ);
    const records = await account.save();
    res.status(201).json({
      message: " Account created successfully",
      records: records,
    });
  } catch (err) {
    res.status(400).json({
      message: " Error in creating account, please try again",
      error: err,
    });
    // console.debug(" Error in creating account : " + err);
  }
  console.debug(" Exited from createAccountController post method :  " + Date.now());
}

async function freezeAccount(req, res) {
  console.debug("--> Entered into freezeAccount" + Date.now());
  try {
    const userId = req.user._id;

    const isAdmin = await accountModel
      .findOne({ userId: userId })
      .select("+SystemUser");

    if (!isAdmin || isAdmin.SystemUser == false) {
      return res.status(400).json({
        message: " Only admin can access",
      });
    }

    const accountId = req.params.accountId;
    const account = await accountModel.findOne({
      _id: accountId,
    });

    const userName = await UserModel.findOne({_id:account.userId})
    if(!account){
      return res.status(400).json({
        message : " Account not found"
      })
    }

    if (account.status != "ACTIVE") {
      return res.status(400).json({
        message: " Only Active account can be frozen",
      });
    }

    account.status = "FROZEN";
    account.modifiedAt = Date.now();
    await account.save();
    
    console.debug("-->" + userName.gmail)
    console.debug("-->" + userName.name)
    await emailService.sendAccountFrozenMail(userName.gmail, userName.name);

    res.status(200).json({
      message: " Account has been frozen successfully by admin",
      account_details: account,
    });
    
  } catch (err) {
    res.status(400).json({
      message: err
    });
  }
  console.debug(" --> Exited from freezeAccount function: " + Date.now());
}

async function unfreezeAccount(req, res) {
  console.debug("--> Entered into unfreezeAccount");
  try {
    const userId = req.user._id;

    const isAdmin = await accountModel.findOne({ userId: userId }).select("+SystemUser");

    if (!isAdmin || isAdmin.SystemUser == false) {
      return res.status(400).json({
        message: " Only admin can access",
      });
    }
    const accountId = req.params.accountId;
    const account = await accountModel.findOne({
      _id: accountId,
    });


    const userName = await UserModel.findOne({_id:account.userId})

    if(!account){
      return res.status(400).json({
        message : " Account not found"
      })
    }

    if (account.status != "FROZEN") {
      return res.status(400).json({
        message: " Only Frozen account can be unfrozen",
      });
    }

    account.status = "ACTIVE";
    account.modifiedAt = Date.now();
    await account.save();
    await emailService.sendUnfrozenMail(userName.gmail, userName.name);


    res.status(200).json({
      message: " Account has been unfrozen successfully by admin",
      account_details: account,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      message: err,
    });
  }
  console.debug(" --> Exited from unfreezeAccount function: " + Date.now());
}

async function getAccountStatus(req, res){
  console.debug("--> Entered into getAccountStatus");
  try{
    const userId = req.user._id;
    const account = await accountModel.findOne({
      userId: userId
    });
    if(!account){
      return res.status(400).json({
        message : " Account not found"
      })
    }
    res.status(200).json({
      message: " Account status retrieved successfully",
      status: account.status
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      message: err,
    });
  }
  console.debug(" --> Exited from getAccountStatus function: " + Date.now());
}

module.exports = {
  createAccountController,
  freezeAccount,
  unfreezeAccount,
  getAccountStatus
};
