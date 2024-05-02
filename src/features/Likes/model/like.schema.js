import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "post",
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "comments",
  },
  timeStamp: {
    type: String,
    default: () => new Date().toLocaleDateString(),
  },
  isLiked: {
    type: Boolean,
    default: false,
  },
});
export default likeSchema;
