import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  fullName: String,
  email: String,
  username: String,
  password: String,
  bio: String,
  profilePicture: String,
  posts: [],
  followers: [],
  following: [],
  gender: String,
  refreshToken: String,
});

export default model('User', userSchema);
