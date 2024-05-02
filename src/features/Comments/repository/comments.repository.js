import mongoose from "mongoose";
import CommentSchema from "../model/comments.schema.js";
import { postSchema } from "../../Posts/model/posts.schems.js";

const postModel = new mongoose.model("post", postSchema);
const commentsModel = new mongoose.model("comments", CommentSchema);

export default class CommentsRepository {
  async addCommentRepo(comment) {
    try {
      const newComment = await commentsModel.create(comment);
      if (newComment) {
        await postModel.findByIdAndUpdate(
          { _id: comment.postId },
          { $push: { comments: newComment } },
          { isNew: true }
        );
      }
      if (newComment) {
        return {
          success: true,
          result: newComment,
        };
      }
      return {
        success: false,
        error: {
          statusCode: 404,
          message: "Could not add comment.",
        },
      };
    } catch (err) {
      return {
        success: false,
        error: {
          statusCode: 404,
          message: err.message,
        },
      };
    }
  }

  async fetchCommentsRepo(criteria) {
    try {
      const comments = await commentsModel.find(criteria);
      if (comments) {
        return {
          success: true,
          result: comments,
        };
      }
      return {
        success: false,
        error: {
          statusCode: 404,
          message: "Could not find comments.",
        },
      };
    } catch (err) {
      return {
        success: false,
        error: {
          statusCode: 404,
          message: err.message,
        },
      };
    }
  }

  async updateCommentRepo(criteria) {
    try {
      const result = await commentsModel.findOneAndUpdate(
        { _id: criteria._id, userId: criteria.userId },
        criteria,
        { isNew: true }
      );
      if (result) {
        return {
          success: true,
          message: "comment updated successfully",
          result: result,
        };
      }
      return {
        success: false,
        error: {
          statusCode: 404,
          message: "Could not find and update comment.",
        },
      };
    } catch (err) {
      return {
        success: false,
        error: {
          statusCode: 404,
          message: err.message,
        },
      };
    }
  }

  async deleteCommentRepo(criteria) {
    try {
      const result = await commentsModel.findOneAndDelete({
        _id: criteria.commentId,
        userId: criteria.userId,
      });
      if (result) {
        return {
          success: true,
          message: "comment deleted successfully",
          result: result,
        };
      }
      return {
        success: false,
        error: {
          statusCode: 404,
          message: "Could not Delete comment.",
        },
      };
    } catch (err) {
      return {
        success: false,
        error: {
          statusCode: 404,
          message: err.message,
        },
      };
    }
  }
}
