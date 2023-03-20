const jwt = require("jsonwebtoken");

//Checks if the token is correct.
//If so, creates a userId field in the req object and set it to the decoded token user id
const checkToken = (req, res, next) => {
  authorization = req.get("Authorization");
  console.log(authorization);

  let decodedToken = "";
  splittedAuthorization = authorization.split(" ");
  const startsWithBearer = splittedAuthorization[0].toLowerCase() === "bearer";

  if (!authorization || !startsWithBearer)
    return res.status(401).json({ error: "invalid or undefined token" });

  const token = splittedAuthorization[1];
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.log(err.message);
  }
  if (decodedToken.id) {
    req.userId = decodedToken.id;
  } else {
    return res.status(401).json({ error: "invalid token" });
  }

  next();
};

module.exports = checkToken;
