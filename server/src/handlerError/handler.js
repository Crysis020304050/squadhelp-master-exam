module.exports = (err, req, res, next) => {
  const {name, message} = err;
  console.log(name, message);
  if (name === 'SequelizeUniqueConstraintError') {
    err.message = 'A record with such parameters already exists';
    err.code = 409;
  }
  if (new RegExp('.+("Banks_balance_ck"|"Users_balance_ck")').test(message)) {
    err.message = 'Bank decline transaction';
    err.code = 402;
  }
  if ( !err.message || !err.code) {
    res.status(500).send('Server Error');
  } else {
    res.status(err.code).send(err.message);
  }
  next(err);
};