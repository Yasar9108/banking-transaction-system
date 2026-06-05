const express = require('express');
const cookieParser = require("cookie-parser");
const app = express();

// import routes
const authRouter = require("./router/auth.router");
const accountRouter = require("./router/account.router");
const transactionRouter = require("./router/transaction.router");

//  create the server  and configire the middlewares with server and routes
// middlewares
app.use(express.json());
app.use(cookieParser());

// useing routes 
app.use("/api/auth", authRouter);
app.use("/api/account", accountRouter);
app.use("/api/transaction", transactionRouter);
module.exports = app;
