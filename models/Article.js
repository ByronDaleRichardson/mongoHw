var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Creates Schema
var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  link: {
    type: String,
    required: true
  },
  saved: {
    type: Boolean,
    required: true,
    default: false
  },
  notes: [{
    type: Schema.Types.ObjectId,
    ref: "Note"
  }]
});

// Creates model with schema
var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
