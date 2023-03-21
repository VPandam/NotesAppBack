const errorHAndler = (error, req, res, next) => {
  console.log(`${error.message} ' on line:  ${error.stack}`);
};

module.exports = errorHAndler;
