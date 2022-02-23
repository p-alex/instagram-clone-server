import { Schema, model } from 'mongoose';

const postSchema = new Schema({
  userId: { type: String, required: true },
  images: { type: [], required: true },
  description: { type: String },
  likes: { type: [], required: true },
  comments: { type: [], required: true },
  postedAt: { type: Number, required: true },
});

export default model('Post', postSchema);
