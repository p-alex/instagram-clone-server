import { Schema, Model } from 'mongoose';

const userSchema = new Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  bio: String,
  profilePicture: String,
  posts: [],
  followers: [],
  following: [],
  gender: String,
});

export default new Model('User', userSchema);
