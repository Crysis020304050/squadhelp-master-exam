const userRouter = require('./userRouter');
const contestsRouter = require('./contestsRouter');
const transactionsRouter = require('./transactionsRouter');
const chatRouter = require('./chatRouter');

const router = require('express')();

router.use(userRouter);
router.use(contestsRouter);
router.use(transactionsRouter);
router.use(chatRouter);


module.exports = router;
