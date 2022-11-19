const express = require('express')
const cors = require('cors')
const reqIntercepter = require('./utils/reqIntercepter.js');
const authRouter = require('./auth/router.js');
const userRouter = require('./user/router.js');
const transactionRouter = require('./transaction/router.js');
const payoutRouter = require('./payout/router.js');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());


app.use("/api/auth", reqIntercepter(), authRouter);
app.use("/api/user", reqIntercepter(true), userRouter);
app.use("/api/transaction", reqIntercepter(true), transactionRouter);
app.use("/api/payout", reqIntercepter(true), payoutRouter);

app.use(express.static("../src/build"));
app.listen(5000);