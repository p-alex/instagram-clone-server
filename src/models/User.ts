import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  bio: { type: String, default: '' },
  profilePicture: { type: String, default: '' },
  posts: {
    count: { type: Number, default: 0 },
    postsList: { type: [Schema.Types.ObjectId], ref: 'Post' },
  },
  followers: {
    count: { type: Number, default: 0, required: true },
    followersList: { type: [Schema.Types.ObjectId], ref: 'User' },
  },
  following: {
    count: { type: Number, default: 0, required: true },
    followingList: { type: [Schema.Types.ObjectId], ref: 'User' },
  },
  gender: { type: String, default: '' },
  joinedAt: { type: Date, default: Date.now() },
  refreshToken: { type: [] },
});

export default model('User', userSchema);
