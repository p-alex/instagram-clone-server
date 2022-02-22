import { Schema, model } from 'mongoose';

const postUserSchema = new Schema({
  id: { type: String, required: true },
  username: { type: String, required: true },
  profilePicture: { type: String },
});

const postSchema = new Schema({
  postedBy: { type: postUserSchema, required: true },
  images: { type: [], required: true },
  description: { type: String },
  likes: { type: [], required: true },
  comments: { type: [], required: true },
  postedAt: { type: Number, required: true },
});

export default model('Post', postSchema);
