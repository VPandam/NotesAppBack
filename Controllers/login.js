const userModel = require("../models/User");
const loginRouter = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateTokenForUser } = require("../helpers/helpers");

loginRouter.post("/", async (req, res, next) => {
  try {
    const { userName, password } = req.body;

    const user = await userModel.findOne({ userName });
    //If the user is not null, compare the password passed by parameter with the user password in the db.
    let authenticationCorrect =
      user === null ? false : await bcrypt.compare(password, user.hashPassword);

    if (authenticationCorrect) {
      const responseUser = generateTokenForUser(user);
      res.status(200).json(responseUser);
    } else res.status(401).json({ error: "invalid user or password" });
  } catch (error) {
    next(error);
  }
});

module.exports = loginRouter;
