import likeSchema from "../model/like.schema.js";
import mongoose from "mongoose";
import ObjectId from "mongodb";
import { postSchema } from "../../Posts/model/posts.schems.js";
import CommentSchema from "../../Comments/model/comments.schema.js";

const postModel = new mongoose.model("post", postSchema);
const commentsModel = new mongoose.model("comments", CommentSchema);
const likeModel = mongoose.model("like", likeSchema);
export default class LikeRepository {
  async fetchLikesRepo(id, type) {
    try {
      let filter = "";
      if (type == "Comment") {
        filter = { comment: id };
      } else {
        filter = { post: id };
      }
      const likes = await likeModel.findOne(filter);
      if (!likes) {
        return {
          success: false,
          error: {
            statusCode: 404,
            message: "No likes found",
          },
        };
      }
      let data = "";
      if (likes.comment) {
        data = await commentsModel.findOne({ _id: likes.comment });
        likes.comment = data;
      } else {
        data = await postModel.findOne({ _id: likes.post });
        likes.post = data;
      }
      return {
        success: true,
        result: likes,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          statusCode: 404,
          message: error.message,
        },
      };
    }
  }
  async toggleLikeRepo(id, userId, type) {
    try {
      let commentID,
        filter,
        postID = "";
      if (type === "Comment") {
        commentID = id;
        filter = { userId: userId, comment: commentID };
      } else {
        postID = id;
        filter = { userId: userId, post: postID };
      }
      const result = await likeModel.findOne(filter);
      if (!result) {
        let data = "";
        if (type === "Comment") {
          data = await commentsModel.findOne({
            _id: new mongoose.Types.ObjectId(commentID),
          });
        } else {
          data = await postModel.findOne({
            _id: new mongoose.Types.ObjectId(postID),
          });
        }
        const createNewLike = await likeModel.create({
          userId: userId,
          ...(type === "Comment" ? { comment: data } : { post: data }),
          isLiked: true,
        });
        return {
          success: true,
          result: createNewLike,
        };
      }
      if (type === "Comment" ? !!result.comment : !!result.post) {
        const filter =
          type === "Comment"
            ? { userId: userId, comment: commentID }
            : { userId: userId, post: postID };
        const updatedResult = await likeModel.findOneAndUpdate(
          filter,
          { $set: { isLiked: !result.isLiked } },
          { new: true }
        );
        return {
          success: true,
          result: updatedResult,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: {
          statusCode: 404,
          message: error.message,
        },
      };
    }
  }
}
