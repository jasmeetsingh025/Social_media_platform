import ApplicationError from "../../../ErrorHandler/errorHandler.js";
import PostRepository from "../repository/posts.repository.js";

export default class PostController {
  constructor() {
    this.PostRepository = new PostRepository();
  }
  async createPost(req, res, next) {
    const { content, imageURL } = req.body;
    const newPost = await this.PostRepository.create({
      content: content,
      userId: req.cookies.userId,
      imageURL: imageURL,
    });
    if (!newPost.success) {
      return next(
        new ApplicationError(newPost.error.message, newPost.error.statusCode)
      );
    }
    return res.status(201).json({
      newPost: newPost,
    });
  }
  async fetchPosts(req, res, next) {
    const { postId } = req.params;
    const userId = req.cookies.userId;
    let posts = "";
    if (postId) {
      posts = await this.PostRepository.findPost({
        userId: userId,
        postId: postId,
      });
    } else {
      posts = await this.PostRepository.findPost({ userId: userId });
    }
    if (!posts.success) {
      return next(
        new ApplicationError(posts.error.message, posts.error.statusCode)
      );
    }
    return res.status(200).send(posts);
  }

  async fetchAllPost(req, res, next) {
    const posts = await this.PostRepository.findAllPost();
    if (!posts.success) {
      return next(
        new ApplicationError(posts.error.message, posts.error.statusCode)
      );
    }
    return res.status(200).send(posts);
  }

  async deletePost(req, res, next) {
    const { postId } = req.params;
    const userId = req.cookies.userId;
    const result = await this.PostRepository.deletePost({
      _id: postId,
      userId: userId,
    });
    if (!result.success) {
      return next(
        new ApplicationError(result.error.message, result.error.statusCode)
      );
    }
    return res.status(200).json({
      success: true,
      message: "post deleted successfully",
    });
  }

  async updatePost(req, res, next) {
    const { postId } = req.params;
    const { content, imageURL } = req.body;
    const userId = req.cookies.userId;
    const result = await this.PostRepository.updatePost({
      _id: postId,
      userId: userId,
      content: content,
      imageURL: imageURL,
    });
    if (!result.success) {
      return next(
        new ApplicationError(result.error.message, result.error.statusCode)
      );
    }
    return res.status(200).send(result);
  }
}
