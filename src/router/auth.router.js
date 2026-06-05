const express = require("express");
const userAuthController = require("../controller/auth.controller");
const router = express.Router();

// Post method for user registration on route /api/auth/register
router.post("/register", userAuthController.registerUserController)

//  post method for user login on route /api/auth/login
router.post("/login", userAuthController.loginUserController)

module.exports = router;
