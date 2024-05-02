import ApplicationError from "../../../ErrorHandler/errorHandler.js";
import CommentRepository from "../repository/comments.repository.js";

export default class CommentController {
  constructor() {
    this.commentRepository = new CommentRepository();
  }

  async addComments(req, res, next) {
    const { comment } = req.body;
    const postId = req.params.postId;
    const userId = req.cookies.userId;
    const newComment = await this.commentRepository.addCommentRepo({
      comment: comment,
      postId: postId,
      userId: userId,
    });
    if (!newComment.success) {
      return next(
        new ApplicationError(
          newComment.error.message,
          newComment.error.statusCode
        )
      );
    }
    return res.status(200).send(newComment);
  }

  async fetchComments(req, res, next) {
    const postId = req.params.postId;
    const comments = await this.commentRepository.fetchCommentsRepo({
      postId: postId,
    });
    if (!comments.success) {
      return next(
        new ApplicationError(comments.error.message, comments.error.statusCode)
      );
    }
    return res.status(200).send(comments);
  }

  async updateComment(req, res, next) {
    const { commentId } = req.params;
    const { comment } = req.body;
    const userId = req.cookies.userId;
    const result = await this.commentRepository.updateCommentRepo({
      _id: commentId,
      comment: comment,
      userId: userId,
    });
    if (!result.success) {
      return next(
        new ApplicationError(result.error.message, result.error.statusCode)
      );
    }
    return res.status(200).send(result);
  }

  async deleteComment(req, res, next) {
    const { commentId } = req.params;
    const userId = req.cookies.userId;
    const result = await this.commentRepository.deleteCommentRepo({
      commentId: commentId,
      userId: userId,
    });
    if (!result.success) {
      return next(
        new ApplicationError(result.error.message, result.error.statusCode)
      );
    }
    return res.status(200).send(result);
  }
}
