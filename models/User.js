const { Schema, model, Model } = require("mongoose");

const userSchema = new Schema({
  userName: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  hashPassword: { type: String, required: true },
  email: { type: String, required: true },
  notesAdded: [
    {
      type: Schema.Types.ObjectId,
      ref: "Note",
    },
  ],
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.hashPassword;
  },
});

const userModel = model("User", userSchema);

module.exports = userModel;
