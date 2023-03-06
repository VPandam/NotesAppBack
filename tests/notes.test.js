const supertest = require("supertest");
const { app, server } = require("../index");
const { default: mongoose } = require("mongoose");
const noteModel = require("../models/Note");
const api = supertest(app);
const { initialNotes } = require("./helpers");

beforeEach(async () => {
  //Delete every note in the db.
  const result = await noteModel.deleteMany({});
  console.log(result);
  //Post initial notes
  for (const note of initialNotes) {
    const newNote = new noteModel(note);
    await newNote.save();
  }
});

// get /notes
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

// get /notes:id
test("passing an id returns the correct note", async () => {
  //Get the id of the first note
  const { body } = await api.get("/notes");
  const { __id: id } = body[0];
  api
    .get("/notes/id")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

// post /notes
test("a valid note can be added", async () => {
  const newNote = {
    content: "new note added with test",
    important: true,
  };
  await api
    .post("/notes")
    .send(newNote)
    .expect(201)
    .expect("Content-Type", /application\/json/);
});

test("a note without content cannot be added", async () => {
  const newNote = {
    important: true,
  };
  const response = await api
    .post("/notes")
    .send(newNote)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  console.log(response.body.message);
});

test("a note without important will always have important = false", async () => {
  const newNote = {
    content: "note without important",
  };

  const note = await api
    .post("/notes")
    .send(newNote)
    .expect(201)
    .expect("Content-Type", /application\/json/);
  expect(note.body.important).toBe(false);
});

afterAll(() => {
  server.close();
  mongoose.connection.close();
});
