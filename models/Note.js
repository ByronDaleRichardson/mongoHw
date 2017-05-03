var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Creates Schema
var NoteSchema = new Schema({
  body: {
    type: String,
    required: true
  }
});

// Creates model with Schema
var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;
