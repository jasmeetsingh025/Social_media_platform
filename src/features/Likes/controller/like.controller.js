import ApplicationError from "../../../ErrorHandler/errorHandler.js";
import LikeRepository from "../repository/like.repository.js";

export default class LikeController {
  constructor() {
    this.likeRepository = new LikeRepository();
  }
  async fetchLikes(req, res, next) {
    const id = req.params.id;
    const type = req.query.type;
    const likes = await this.likeRepository.fetchLikesRepo(id, type);
    if (!likes.success) {
      return next(
        new ApplicationError(likes.error.message, likes.error.statusCode)
      );
    }
    return res.status(200).send(likes);
  }
  async toggleLike(req, res, next) {
    const id = req.params.id;
    const type = req.query.type;
    const userId = req.cookies.userId;
    const result = await this.likeRepository.toggleLikeRepo(id, userId, type);
    if (!result.success) {
      return next(
        new ApplicationError(result.error.message, result.error.statusCode)
      );
    }
    return res.status(200).send(result);
  }
}
