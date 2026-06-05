const express  = require("express");
const router = express.Router();
const accountController = require("../controller/account.controller");
const authMiddleWare = require("../middleware/auth.middleware");
// post method for creating a new account on route /api/accounts/create

// post method for creating a new account on route /api/account/
router.post("/", authMiddleWare.authMddleware, accountController.createAccountController)

//admin patch method to freeze account

router.patch("/admin/:accountId/freeze", authMiddleWare.systemAuthMiddleWare, accountController.freezeAccount)

// admin patch method to unfreeze account
router.patch("/admin/:accountId/unfreeze", authMiddleWare.systemAuthMiddleWare, accountController.unfreezeAccount)

// get method for checking account status on route /api/account/:accountId/status
router.get("/status", authMiddleWare.authMddleware, accountController.getAccountStatus)
module.exports = router;
