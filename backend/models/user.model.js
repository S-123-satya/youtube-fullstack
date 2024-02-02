import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    picUrl: {
      type: String,
      required: [true, "PicUrl is required"],
    },
    coverImage: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    subscriberCount: {
      type: Number,
      default:0,
    },
    channelSubscribeCount: {
      type: Number,
      default:0,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
