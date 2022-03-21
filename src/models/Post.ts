import { Schema, model } from 'mongoose';

const postSchema = new Schema({
  user: { type: { id: String, username: String, profilePicture: String } },
  images: { type: [], required: true },
  description: { type: String },
  likes: {
    count: { type: Number, default: 0 },
    users: [],
  },
  comments: {
    count: { type: Number, default: 0, required: true },
    userComments: { type: [{ type: Schema.Types.ObjectId, ref: 'Comment' }] },
  },
  postedAt: { type: Number, default: Date.now(), required: true },
});

export default model('Post', postSchema);
