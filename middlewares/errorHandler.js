const errorHAndler = (error, req, res, next) => {
  console.log(error.message);
};

module.exports = errorHAndler;
