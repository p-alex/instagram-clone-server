import { Schema, model } from 'mongoose';

const commentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    comment: { type: String, required: true },
    likes: {
      count: { type: Number, default: 0 },
      users: { type: [Schema.Types.ObjectId], ref: 'User' },
    },
  },
  {
    timestamps: true,
  }
);

export default model('Comment', commentSchema);
