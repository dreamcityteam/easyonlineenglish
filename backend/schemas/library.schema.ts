import mongoose, { Schema } from 'mongoose';

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

export default Library;
