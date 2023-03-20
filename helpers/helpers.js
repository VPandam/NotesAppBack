const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const initialNotes = [
  {
    content: "first note",
    important: true,
  },
  {
    content: "second note",
    important: false,
  },
];
const initialUsers = [
  {
    name: "first user",
    userName: "aaa",
    password: "1234",
    email: "first@hotmail.com",
  },
  {
    name: "second user",
    userName: "bbb",
    password: "5678",
    email: "second@hotmail.com",
  },
];

const encryptPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const generateTokenForUser = (user) => {
  const { _id, userName, name } = user;
  userForToken = {
    id: _id,
    userName,
    name,
  };
  const token = jwt.sign(userForToken, process.env.JWT_SECRET);
  return (userWithToken = { ...userForToken, token });
};

module.exports = {
  initialNotes,
  initialUsers,
  encryptPassword,
  generateTokenForUser,
};
