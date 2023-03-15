const supertest = require("supertest");
const { app, server } = require("../index");
const { mongoose } = require("mongoose");
const noteModel = require("../models/Note");
const api = supertest(app);
const { initialNotes } = require("../helpers/helpers");

beforeEach(async () => {
  //Delete every note in the db.
  await noteModel.deleteMany({});
  //Post initial notes
  for (const note of initialNotes) {
    const newNote = new noteModel(note);
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
    const { body } = await api.get("/notes");
    const { id } = body[0];
    console.log(id);
    const result = await api
      .get(`/notes/${id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
  test("passing a wrong id returns 404", async () => {
    const id = "wrongId";
    await api.get(`/notes/${id}`).expect(404);
  });
});

describe("post notes", () => {
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
});

describe("delete notes by id", () => {
  test("passing a valid id returns the deleted note", async () => {
    const { body: notes } = await api.get("/notes");
    const { id } = notes[0];
    await api
      .delete(`/notes/${id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    await api.get(`/notes/${id}`).expect(null);
  });
  test("passing a wrong id returns 404", async () => {
    const id = "wrongID";
    await api.delete(`/notes/${id}`).expect(404);
  });
});

afterAll(() => {
  server.close();
  mongoose.connection.close();
});
