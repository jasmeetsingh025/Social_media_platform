import ApplicationError from "../../../ErrorHandler/errorHandler.js";
import FriendsRepository from "../repository/friends.repository.js";

export default class FriendsController {
  constructor() {
    this.friendsRepository = new FriendsRepository();
  }
  async fetchFriends(req, res, next) {
    const userId = req.params.userId;
    const friends = await this.friendsRepository.fetchFriendsRepo(userId);
    if (!friends.success) {
      return next(
        new ApplicationError(friends.error.message, friends.error.statusCode)
      );
    }
    res.status(200).send(friends);
  }
  async fetchPendingRequests(req, res, next) {
    const userId = req.cookies.userId;
    const friends = await this.friendsRepository.fetchPendingRequestsRepo(
      userId
    );
    if (!friends.success) {
      return next(
        new ApplicationError(friends.error.message, friends.error.statusCode)
      );
    }
    res.status(200).send(friends);
  }
  async toggleFriendship(req, res, next) {
    const friendsId = req.params.friendsId;
    const userId = req.cookies.userId;
    const friends = await this.friendsRepository.toggleFriendshipRepo(
      userId,
      friendsId
    );
    if (!friends.success) {
      return next(
        new ApplicationError(friends.error.message, friends.error.statusCode)
      );
    }
    res.status(200).send(friends);
  }
  async responseToRequest(req, res, next) {
    const friendId = req.params.friendsId;
    const userId = req.cookies.userId;
    const friends = await this.friendsRepository.responseToRequestRepo(
      userId,
      friendId
    );
    if (!friends.success) {
      return next(
        new ApplicationError(friends.error.message, friends.error.statusCode)
      );
    }
    res.status(200).send(friends);
  }
}
