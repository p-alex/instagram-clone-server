import { Schema, model } from 'mongoose';

const postSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  images: { type: [], required: true },
  description: { type: String },
  likes: {
    count: { type: Number, default: 0 },
    users: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }] },
  },
  comments: {
    count: { type: Number, default: 0, required: true },
    userComments: { type: [{ type: Schema.Types.ObjectId, ref: 'Comment' }] },
  },
  postedAt: { type: Date, default: Date.now(), required: true },
});

export default model('Post', postSchema);
