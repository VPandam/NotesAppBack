const supertest = require("supertest");
const { app, server } = require("../index");
const UserModel = require("../models/User");
const { initialUsers, encryptPassword } = require("../helpers/helpers");
const { default: mongoose } = require("mongoose");

const api = supertest(app);
beforeEach(async () => {
  await UserModel.deleteMany({});
  for (const user of initialUsers) {
    const { name, userName, password, email } = user;
    const hash = await encryptPassword(password);
    const newUser = new UserModel({
      name,
      userName,
      hashPassword: hash,
      email,
    });
    await newUser.save();
  }
});

test("beforeEach deletes every user and post 2 initial users", async () => {
  const users = await UserModel.find({});
  expect(users).toHaveLength(2);
});

describe("post users", () => {
  test("passing a valid user returns the posted user", async () => {
    const validUser = {
      name: "aaa",
      userName: "bbbb",
      email: "aaa@hotmail.com",
      password: "123456",
    };
    const usersBeforePost = await UserModel.find({});

    await api
      .post("/users")
      .send(validUser)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const usersAfterPost = await UserModel.find({});
    expect(usersAfterPost).toHaveLength(usersBeforePost.length + 1);
    expect(usersAfterPost.map((user) => user.userName)).toContain(
      validUser.userName
    );
  });
});

describe("get users", () => {
  test("users are returned as json", async () => {
    const users = await api
      .get("/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
});

afterAll(() => {
  server.close();
  mongoose.connection.close();
});
