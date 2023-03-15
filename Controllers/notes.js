const notesRouter = require("express").Router();
const NoteModel = require("../models/Note");
const userModel = require("../models/User");

notesRouter.get("/", (req, res, next) => {
  NoteModel.find()
    .populate("user", { name: 1, userName: 1 })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      next(err);
    });
});

notesRouter.get("/:id", (req, res, next) => {
  const { id } = req.params;
  NoteModel.findById(id)
    .populate("user", { name: 1, userName: 1 })
    .then((result) => {
      if (result === null) {
        res.status(404);
      }
      console.log(result);
      res.json(result).status(200);
    })
    .catch((err) => {
      res.status(404).send("Note not found");
      next(err);
    });
});

notesRouter.post("/", async (req, res, next) => {
  const { content, important, user } = req.body;

  const newNote = NoteModel({
    content: content,
    date: new Date(),
    important: important || false,
    user: user,
  });
  try {
    const noteAdded = await newNote.save();
    console.log(noteAdded + "note added");
    const userDB = await userModel.findById(user);
    console.log(userDB);
    userDB.notesAdded.push(noteAdded._id);
    await userDB.save();
    res.status(201).json(noteAdded);
  } catch (err) {
    res.status(400).json(err.message);
    next(err);
  }
});

notesRouter.delete("/:id", (req, res, next) => {
  const { id } = req.params;
  NoteModel.findByIdAndDelete(id)
    .then((result) => {
      console.log(result);
      if (result) {
        res.status(200).json(result);
        console.log(result);
      } else {
        res.status(404).json(result);
      }
    })
    .catch((err) => {
      res.status(404).send("Note not found");
      next(err);
    });
});
notesRouter.put("/:id", (req, res) => {
  const { body } = req;
  const { id } = req.params;

  NoteModel.findById(id)
    .then((foundNote) => {
      if (body.content) foundNote.content = body.content;
      if (body.important.typeof !== undefined)
        foundNote.important = body.important;
      foundNote.save().then((result) => {
        console.log(result);
        res.json(result);
      });
    })
    .catch((err) => {
      res.send(err.message);
      next(err);
    });
});
// notesRouter.delete("/all", (req, res, next) => {
//   NoteModel.deleteMany({})
//     .then((result) => {
//       res.status(202).json(result);
//     })
//     .catch((err) => {
//       res.status(404).send(err.message);
//       next(err);
//     });
// });

module.exports = notesRouter;
