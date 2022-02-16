import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  bio: { type: String },
  profilePicture: { type: String },
  posts: { type: [] },
  followers: { type: [] },
  following: { type: [] },
  gender: { type: String },
  refreshToken: { type: String },
});

export default model('User', userSchema);
