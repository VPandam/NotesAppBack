const notesRouter = require("express").Router();
const NoteModel = require("../models/Note");
const userModel = require("../models/User");
const checkToken = require("../middlewares/checkToken");
const mongoose = require("mongoose");

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

notesRouter.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res
      .status(400)
      .json({ error: "id has not a valid format or is undefined" });
  }
  try {
    const note = await NoteModel.findOne({ _id: id });
    console.log(note);
    if (note === null) {
      res.status(404).json({ error: "note not found" });
    } else {
      res.json(note).status(200);
    }
  } catch (err) {
    next(err);
  }
});

notesRouter.post("/", checkToken, async (req, res, next) => {
  const { content, important } = req.body;
  const user = req.userId;
  const newNote = NoteModel({
    content: content,
    date: new Date(),
    important: important || false,
    user: user,
  });
  try {
    const noteAdded = await newNote.save();
    const userDB = await userModel.findById(user);
    userDB.notesAdded.push(noteAdded._id);
    await userDB.save();
    res.status(201).json(noteAdded);
  } catch (err) {
    res.status(400).json(err.message);
    next(err);
  }
});

notesRouter.delete("/:id", checkToken, (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res
      .status(400)
      .json({ error: "id has not a valid format or is undefined" });
  }
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
      next(err);
    });
});
notesRouter.put("/:id", checkToken, (req, res) => {
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
