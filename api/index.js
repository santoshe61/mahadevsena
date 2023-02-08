const express = require('express')
const cors = require('cors')
const reqIntercepter = require('./utils/reqIntercepter.js');
const authRouter = require('./auth/router.js');
const userRouter = require('./user/router.js');
const transactionRouter = require('./transaction/router.js');
const payoutRouter = require('./payout/router.js');
const profileRouter = require('./profile/router.js');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());


app.use("/api/auth", reqIntercepter(), authRouter);
app.use("/api/user", reqIntercepter(true), userRouter);
app.use("/api/transaction", reqIntercepter(true), transactionRouter);
app.use("/api/payout", reqIntercepter(true), payoutRouter);
app.use("/api/profile", reqIntercepter(true), profileRouter);

app.use(express.static("../dist/spa"));

app.listen(process.env.PORT || 5000);