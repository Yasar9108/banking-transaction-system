const accountModel = require("../models/account.model");
const transactionModel = require("../models/transaction.model");
const userModel = require("../models/user.model");
const ledgerModel = require("../models/ledger.model");
const gmailService = require("../service/gmail.service");
const mongoose = require("mongoose");
const LedgerModel = require("../models/ledger.model");
//   10 Step transfer flow
//   1. validate request
//   2. validate idempotency key
//   3. check account status
//   4. drive sender balance from ledger

async function createTransactionController(req, res) {
  const { amount, senderAccountId, idempotencyKey, receiverAccountId, status } =
    req.body;

  //  validate the request body for required fields and valid amount
  if (!senderAccountId || !receiverAccountId || !idempotencyKey || !amount) {
    return res.status(400).json({
      message: "  required fields are missing",
    });
  }

  const fromSenderAccount = await accountModel.findOne({
    _id: senderAccountId,
  });

  const toReceiverAccount = await accountModel.findOne({
    _id: receiverAccountId,
  });

  if (!fromSenderAccount || !toReceiverAccount) {
    return res.send(400).json({
      message: " account does not exits",
    });
  }

  const ifTransactionAlreadyExits = await transactionModel.findOne({
    idempotencykey: idempotencyKey,
  });

  if (ifTransactionAlreadyExits) {
    if (ifTransactionAlreadyExits.status == "Completed") {
      return res.status(200).json({
        message: "Transaction Processing has been completed",
      });
    }

    if (ifTransactionAlreadyExits.status == "Pending") {
      return res.status(200).json({
        message: "Transaction is in Pending",
      });
    }

    if (ifTransactionAlreadyExits.status == "Failed") {
      return res.status(200).json({
        message: "Transaction Processing Failed, please retry",
      });
    }

    if (ifTransactionAlreadyExits.status == "Reversed") {
      return res.status(200).json({
        message: "Transaction was reversed, please retry",
      });
    }
  }

  if (
    fromSenderAccount.status != "ACTIVE" ||
    toReceiverAccount.status != "ACTIVE"
  ) {
    return res.status(400).json({
      message: " Both Account must be active for transaction",
    });
  }

  // calculate balance of sender account from ledger and check if sufficent balance is there to process the transaction

  const balance = await fromSenderAccount.getBalance();

  if (balance < amount) {
    return res.status(400).json({
      message: ` Insufficient balance in sender account, avalilable balance is ${balance}, required amount is ${amount}`,
    });
  }

  // create a transaction

  const session = await mongoose.startSession();
  session.startTransaction();

  const transaction = new transactionModel({
    senderAccountId: senderAccountId,
    receiverAccountId: receiverAccountId,
    amount: amount,
    idempotencykey: idempotencyKey,
    status: "Pending",
    timeStamp: Date.now(),
  });

  // update Ledger for sender accoount with debit entry

  const senderLedgerEntry = new LedgerModel({
    accountId: senderAccountId,
    amount: amount,
    type: "Debit",
    transactionId: transaction._id,
    timeStamp: Date.now(),
  });
  await senderLedgerEntry.save({ session });

  // update Ledger for receiver accoount with credit entry

  const receiverLedgerEntry = new LedgerModel({
    accountId: receiverAccountId,
    amount: amount,
    type: "Credit",
    transactionId: transaction._id,
    timeStamp: Date.now(),
  });
  await receiverLedgerEntry.save({ session });

  //  update transaction status to completed

  transaction.status = "Completed";
  await transaction.save({ session });
  await session.commitTransaction();
  session.endSession();

  // send email notification to sender and receiver about transaction

  await gmailService.sendTransactionEmail(
    req.user.gmail,
    req.user.name,
    amount,
    toReceiverAccount._id,
  );

  res.status(201).json({
    message: " Transaction processed successfully",
    transactionId: transaction._id,
  });
}

async function createInitialTransactionController(req, res) {
  const { amount, receiverAccountId, idempotencyKey } = req.body;

  if (!receiverAccountId || !idempotencyKey || !amount) {
    return res.status(400).json({
      message: " required fields are missing",
    });
  }

  const toReceiverAccountId = await accountModel.findOne({
    _id: receiverAccountId,
  });

  if (!toReceiverAccountId) {
    return res.status(400).json({
      message: " account does not exits",
    });
  }

  const adminId = await accountModel.findOne({
    userId: req.user._id,
    SystemUser: true,
  });

  if (!adminId) {
    return res.status(400).json({
      message: " admin account does not exits",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const transaction = new transactionModel({
    senderAccountId: adminId._id,
    receiverAccountId: receiverAccountId,
    amount: amount,
    idempotencykey: idempotencyKey,
    status: "Pending",
    timeStamp: Date.now(),
  });

  // update Ledger for sender accoount with debit entry
  const senderLedgerEntry = new LedgerModel({
    accountId: adminId._id,
    amount,
    type: "Debit",
    transactionId: transaction._id,
    timeStamp: Date.now(),
  });
  await senderLedgerEntry.save({ session });

  // update Ledger for receiver accoount with credit entry

  const receiverLedgerEntry = new LedgerModel({
    accountId: receiverAccountId,
    amount,
    type: "Credit",
    transactionId: transaction._id,
    timeStamp: Date.now(),
  });

  await receiverLedgerEntry.save({ session });

  //  update transaction status to completed

  transaction.status = "Completed";
  await transaction.save({ session });
  await session.commitTransaction();
  session.endSession();

  res.status(200).json({
    message: "intial funds has been processed sucussfully",
  });
}

async function getAccountBalance(req, res) {
  try {
    console.debug(" --> Entered into getAccountBalance get method :  " + Date.now());
    const accountId = req.params.accountId;

    const account = await accountModel.findOne({
      _id: accountId,
    });

    if (!account) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    const balance = await account.getBalance();

    if (balance < 0) {
      return res.status(400).json({
        message: " Account balance fetched successfully ",
        amount: 0,
      });
    }

    console.debug(`--> Account balance fetched successfully : ${balance} ` + Date.now());

    res.status(200).json({
      message: " Account balance fetched successfully",
      balance: balance,
    });
  } catch (err) {
    res.status(500).json({
      message: " Internal server error",
      error: err.message,
    });
  }
  console.debug(" --> Exited from getAccountBalance get method :  " + Date.now());
}

async function getAccountTransactionHistory(req, res) {
  try {
    const accountId = req.params.accountId;

    const accountData = await ledgerModel.find({});
    const transactionData = await transactionModel.find({});
    if (!accountData || accountData.length == 0) {
      return res.status(404).json({
        message: " Account not found",
      });
    }
    var record = [];
    var transactionId;

    for (var i = 0; i < accountData.length; i++) {
      var records = new Object();
      if (accountData[i].accountId == accountId) {
        records.transactionId = accountData[i].transactionId;
        records.counterpartyAccountId = accountData[i].accountId;
        transactionId = accountData[i].transactionId;
        records.type = accountData[i].type;
        records.amount = accountData[i].amount;
        for (var j = 0; j < transactionData.length; j++) {
          if (transactionData[j]._id.toString() == transactionId.toString()) {
            records.status = transactionData[j].status;
            break;
          }
        }
        record.push(records);
      }
    }

    res.status(200).json({
      message: " Account transaction history fetched successfully",
      record: record,
    });
  } catch (err) {
    console.error(" --> Error occurred while fetching account transaction history :  " + Date.now());
    res.status(500).json({
      message: " Internal server error",
      error: err.message,
    });
  }
  console.debug(" --> Exited from getAccountTransactionHistory get method :  " + Date.now());
}

async function getTransactionDetails(req, res) {
  console.debug("--> Entered into getTransactionDetails: " + Date.now());
  try {
    const transactionId = req.params.transactionId;
    var transactionData = await transactionModel.find({ _id: transactionId });
    if (!transactionData) {
      return res.status(404).json({
        message: " Transaction not found",
      });
    }
    res.status(200).json({
      records: transactionData,
    });
    
  } catch (err) {
    res.status(400).json({
      message: err,
    });
  }
  console.debug("--> Exited from getTransactionDetails: " + Date.now());
}

module.exports = {
  createTransactionController,
  createInitialTransactionController,
  getAccountBalance,
  getTransactionDetails,
  getAccountTransactionHistory,
};
