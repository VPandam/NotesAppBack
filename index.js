const express = require("express");
const logger = require("./loggerMiddleware");
const cors = require("cors");

let notes = [
  {
    id: 1,
    content: "Me tengo que suscribir",
    date: "2019-05-30T17:30:31.0982",
    important: true,
  },
  {
    id: 2,
    content: "Tengo que estudiar las clases",
    date: "2019-05-30T18:30:31.0912",
    important: false,
  },
  {
    id: 3,
    content: "Repasar los retos de JS de midu",
    date: "2019-05-30T19:20:31.0982",
    important: true,
  },
];
const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json());
app.use(cors());
app.use(logger);

app.get("/", (req, res) => {
  res.send("HelloPutito");
});

app.get("/notes", (req, res) => {
  res.json(notes);
});

app.get("/notes/:id", (req, res) => {
  const { params } = req;
  const reqID = Number(params.id);
  const foundNote = notes.find(({ id }) => id === reqID);
  if (foundNote) res.json(foundNote);
  else {
    res.status(404).send("Note not found").end();
  }
});

app.post("/notes", (req, res) => {
  const { content, important } = req.body;
  if (!req.body || !content) {
    return res.status(400).json({
      error: "note content is required",
    });
  }
  const notesIds = notes.map(({ id }) => id);
  const newID = Math.max(...notesIds) + 1;

  const newNote = {
    id: newID,
    content,
    date: new Date().toUTCString(),
    important: important || false,
  };
  notes = [...notes, newNote];
  res.status(201).json(newNote);
});

app.delete("/notes/:id", (req, res) => {
  const reqID = Number(req.params.id);
  notes = notes.filter(({ id }) => id !== reqID);
  res.status(204).end();
});

app.listen(PORT, () => console.log(`Application running on port ${PORT}`));
