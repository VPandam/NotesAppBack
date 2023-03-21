const supertest = require("supertest");
const { app, server } = require("../index");
const { mongoose } = require("mongoose");
const noteModel = require("../models/Note");
const userModel = require("../models/User");
const api = supertest(app);
const { initialNotes, generateTokenForUser } = require("../helpers/helpers");

beforeEach(async () => {
  //Delete every note in the db.
  await noteModel.deleteMany({});

  const users = await userModel.find({});
  const userId = users[0].id;
  //Post initial notes
  for (const note of initialNotes) {
    const newNote = new noteModel(note);
    newNote.user = userId;
    await newNote.save();
  }
});

describe("get all notes", () => {
  test("notes are returned as json", async () => {
    await api
      .get("/notes")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("there are 2 initial notes", async () => {
    const { body } = await api.get("/notes");
    expect(body).toHaveLength(2);
  });
});

describe("Get notes by id", () => {
  test("passing an id returns the correct note", async () => {
    //Get the id of the first note
    const user = await userModel.findOne({});
    const { body } = await api.get("/notes");
    const { id } = body[0];
    await api
      .get(`/notes/${id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("passing a wrong id returns 400", async () => {
    const id = "wrongId";
    await api.get(`/notes/${id}`).expect(400);
  });
  test("passing a valid type id with null result returns 404", async () => {
    const id = "6418dfde72b56b1e9c09de36";
    await api.get(`/notes/${id}`).expect(404);
  });
});

describe("post notes", () => {
  test("a valid note can be added", async () => {
    user = await userModel.findOne();
    const { token } = generateTokenForUser(user);
    const newNote = {
      content: "new note added with test",
      important: true,
    };
    await api
      .post("/notes")
      .set({ Authorization: `Bearer ${token}` })
      .send(newNote)
      .expect(201)
      .expect("Content-Type", /application\/json/);
  });

  test("a note without content cannot be added", async () => {
    user = await userModel.findOne();
    const { token } = generateTokenForUser(user);
    const newNote = {
      important: true,
    };
    const response = await api
      .post("/notes")
      .set({ Authorization: `Bearer ${token}` })
      .send(newNote)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  test("a note without important will always have important = false", async () => {
    user = await userModel.findOne();
    const { token } = generateTokenForUser(user);
    const newNote = {
      content: "note without important",
    };

    const note = await api
      .post("/notes")
      .set({ Authorization: `Bearer ${token}` })
      .send(newNote)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    expect(note.body.important).toBe(false);
  });
});

describe("delete notes by id", () => {
  test("passing a valid id returns the deleted note", async () => {
    user = await userModel.findOne();
    const { token } = generateTokenForUser(user);
    const { body: notes } = await api.get("/notes");
    const { id } = notes[0];
    console.log(id);
    await api
      .delete(`/notes/${id}`)
      .set({ Authorization: `Bearer ${token}` })
      .expect(200)
      .expect("Content-Type", /application\/json/);
    await api.get(`/notes/${id}`).expect(404);
  });
  test("passing a bad type id returns 400", async () => {
    user = await userModel.findOne();
    const { token } = generateTokenForUser(user);
    const id = "wrongID";
    await api
      .delete(`/notes/${id}`)
      .set({ Authorization: `Bearer ${token}` })
      .expect(400);
  });
  test("passing a valid id but null in the db returns 404", async () => {
    user = await userModel.findOne();
    const { token } = generateTokenForUser(user);
    const id = "6418eb5fdebb9181e3ab2f90";
    await api
      .delete(`/notes/${id}`)
      .set({ Authorization: `Bearer ${token}` })
      .expect(404);
  });
});

afterAll(() => {
  server.close();
  mongoose.connection.close();
});
