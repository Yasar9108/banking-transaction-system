const express = require("express");
const router = express.Router();
const transactionController = require("../controller/transaction.controller");
const middleWare = require("../middleware/auth.middleware");

// post method for creating a new transaction on route /api/transaction/
router.post("/",middleWare.authMddleware, transactionController.createTransactionController)

// post method for creating a intial funds transaction through admin or systemUser pn route /api/transaction/system/intialFunds
router.post("/system/initial-funds", middleWare.systemAuthMiddleWare, transactionController.createInitialTransactionController);

// get method for fetching account balance on route /api/transaction/account/:accountId/balance
router.get("/account/:accountId/balance", middleWare.authMddleware, transactionController.getAccountBalance)

// get method for fetching transactions history  using accountId /api/transaction/account/:accountId/history
router.get("/account/:accountId/history", middleWare.authMddleware, transactionController.getAccountTransactionHistory)

// get method for fetching tranaction details on route /api/transaction/account/:transactionId/transaction-details
router.get("/:transactionId", middleWare.authMddleware, transactionController.getTransactionDetails)

module.exports = router;

