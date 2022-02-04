import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  bio: { type: String, required: true },
  profilePicture: { type: String, required: true },
  posts: { type: [], required: true },
  followers: { type: [], required: true },
  following: { type: [], required: true },
  gender: { type: String, required: true },
  refreshToken: { type: String, required: true },
});

export default model('User', userSchema);
