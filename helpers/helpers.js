const bcrypt = require("bcrypt");

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

module.exports = { initialNotes, initialUsers, encryptPassword };
