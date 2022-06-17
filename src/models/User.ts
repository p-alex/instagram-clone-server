import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    status: {
      type: String,
      enum: ["Pending", "Active", "Suspended"],
      default: "Pending",
    },
    confirmationCode: {
      type: String,
      unique: false,
    },
    fullname: { type: String, required: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String, default: "" },
    profilePicture: {
      fullPicture: {
        type: String,
        default: "/images/default-profile-picture.jpg",
      },
      smallPicture: {
        type: String,
        default: "/images/default-profile-picture.jpg",
      },
    },
    posts: {
      count: { type: Number, default: 0 },
      postsList: { type: [Schema.Types.ObjectId], ref: "Post" },
    },
    followers: {
      count: { type: Number, default: 0, required: true },
      followersList: { type: [Schema.Types.ObjectId], ref: "User" },
    },
    following: {
      count: { type: Number, default: 0, required: true },
      followingList: { type: [Schema.Types.ObjectId], ref: "User" },
    },
    gender: { type: String, default: "" },
    isPrivate: { type: Boolean, default: false, required: true },
    refreshToken: { type: [] },
  },
  { timestamps: true }
);

export default model("User", userSchema);
