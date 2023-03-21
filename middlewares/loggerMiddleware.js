const logger = (req, res, next) => {
  console.log(req.body)
  console.log(req.url)
  console.log(req.method)
  console.log('------')
  next();
};

module.exports = logger;
