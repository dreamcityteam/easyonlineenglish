const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContentSchema = new Schema({
  englishWord: String,
  spanishTranslation: String,
  imageUrl: String,
  audioUrl: String
});

const LibrarySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  content: [ContentSchema]
});

const Library = mongoose.model('Library', LibrarySchema);
module.exports = Library;
