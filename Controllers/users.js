const usersRouter = require("express").Router();
const userModel = require("../models/User");
const { encryptPassword } = require("../helpers/helpers");

usersRouter.post("/", async (req, res, next) => {
  const { name, userName, password, email } = req.body;
  if (!(name && userName && password && email))
    res.status(400).send("name, user name, email and password are required")
      .end;
  const hash = await encryptPassword(password);
  const newUser = userModel({
    name,
    userName,
    hashPassword: hash,
    email,
  });
  await newUser
    .save()
    .then((result) => {
      console.log(result);
      res.json(result).status(201);
    })
    .catch((err) => {
      res.status(400).send(err.message);
      next(err);
    });
});

usersRouter.get("/", async (req, res, next) => {
  const users = await userModel
    .find({})
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      res.status(404);
      next(err);
    });
});

module.exports = usersRouter;
