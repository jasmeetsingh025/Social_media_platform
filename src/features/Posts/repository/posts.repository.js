import mongoose from "mongoose";
import { postSchema } from "../model/posts.schems.js";

const postModel = new mongoose.model("post", postSchema);

export default class PostRepository {
  async create(post) {
    try {
      const newPost = await postModel.create(post);
      return {
        success: true,
        message: "post created successfully",
        result: newPost,
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
  async findPost(criteria) {
    try {
      let posts = "";
      let query = {};
      if (criteria.postId) {
        query = { _id: criteria.postId, userId: criteria.userId };
        posts = await postModel.find(query);
      } else {
        query = { userId: criteria.userId };
        posts = await postModel.find(query);
      }
      return {
        success: true,
        result: posts,
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

  async findAllPost() {
    try {
      const posts = await postModel.find();
      return {
        success: true,
        result: posts,
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

  async deletePost(criteria) {
    try {
      await postModel.findOneAndDelete(criteria);
      return {
        success: true,
        message: "post deleted successfully",
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

  async updatePost(criteria) {
    try {
      const result = await postModel.findOneAndUpdate(
        { _id: criteria._id },
        criteria
      );
      return {
        success: true,
        message: "post updated successfully",
        result: result,
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
