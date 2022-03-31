import { Schema, model } from 'mongoose';

const postSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  images: [
    {
      fullImage: { url: String, public_id: String },
      croppedImage: { url: String, public_id: String },
    },
  ],
  description: { type: String },
  likes: {
    count: { type: Number, default: 0 },
    users: { type: [Schema.Types.ObjectId], ref: 'User' },
  },
  comments: {
    count: { type: Number, default: 0, required: true },
    userComments: { type: [Schema.Types.ObjectId], ref: 'Comment' },
  },
  postedAt: { type: Date, required: true },
});

export default model('Post', postSchema);
