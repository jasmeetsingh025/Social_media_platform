import mongoose from "mongoose";
import FriendsSchems from "../model/friends.model.js";
import { userSchema } from "../../User/model/user.schema.js";

const userModel = mongoose.model("User", userSchema);
const friendsModel = mongoose.model("Friends", FriendsSchems);

export default class FriendsRepository {
  async fetchFriendsRepo(userId) {
    try {
      const friendsfromSchema = await friendsModel.find({
        userId: userId,
        isAccepted: true,
      });
      if (friendsfromSchema.length <= 0) {
        return {
          success: false,
          error: {
            statusCode: 404,
            message: "No friends found",
          },
        };
      }
      const friendIds = friendsfromSchema.map((friend) => friend.friendId);
      let friends = await userModel
        .findById({
          _id: new mongoose.Types.ObjectId(userId),
        })
        .select("-password");
      const friendData = await userModel.find({
        _id: { $in: friendIds },
      });
      friends.friends = friendData;
      await friends.save();
      if (friends.length <= 0) {
        return {
          success: false,
          error: {
            statusCode: 404,
            message: "No friends found who accepted the request",
          },
        };
      }
      return {
        success: true,
        message: "Friends fetched successfully",
        result: friends,
      };
    } catch (err) {
      return {
        success: false,
        error: {
          statusCode: 500,
          message: err.message,
        },
      };
    }
  }

  async fetchPendingRequestsRepo(userId) {
    try {
      const friends = await friendsModel.find(
        { userId: userId },
        { isAccepted: false }
      );
      if (friends.length <= 0) {
        return {
          success: false,
          error: {
            statusCode: 404,
            message: "No friends found",
          },
        };
      }
      return {
        success: true,
        message: "Friends fetched with pending request successfully",
        result: friends,
      };
    } catch (err) {
      return {
        success: false,
        error: {
          statusCode: 500,
          message: err.message,
        },
      };
    }
  }
  async toggleFriendshipRepo(userId, friendId) {
    try {
      const friendIds = await friendsModel.findOne({
        userId: userId,
        friendId: { $in: [friendId] },
      });
      let friendIDs = [];
      friendIDs.push(friendId);
      if (!friendIds) {
        const result = await friendsModel.create({
          userId: userId,
          friendId: friendIDs,
          isAccepted: false,
        });
        const userData = await userModel.findById(userId).select("-password");
        const friendData = await userModel
          .findById(friendId)
          .select("-password");
        result.userId = userData;
        result.friendId = friendData;
        return {
          success: true,
          message: "Friend request sent successfully",
          result: result,
        };
      }

      const toggleFriendReq = !friendIds.isAccepted;
      const updatedResult = await friendsModel.findOneAndUpdate(
        { userId: userId, friendId: { $in: [friendId] } },
        { $set: { isAccepted: toggleFriendReq } },
        { new: true }
      );

      const userData = await userModel.findById(userId).select("-password");
      const friendData = await userModel.findById(friendId).select("-password");
      updatedResult.userId = userData;
      updatedResult.friendId = [friendData];
      return {
        success: true,
        message: "Friend request toggled successfully",
        result: updatedResult,
      };
    } catch (err) {
      return {
        success: false,
        error: {
          statusCode: 500,
          message: err.message,
        },
      };
    }
  }

  async responseToRequestRepo(userId, friendId) {
    try {
      // Update friend status
      const updatedFriend = await friendsModel.findOneAndUpdate(
        { userId, friendId, isAccepted: false },
        { $set: { isAccepted: true } },
        { new: true }
      );

      if (!updatedFriend) {
        return {
          success: false,
          error: {
            statusCode: 404,
            message: "Friend request not found or already accepted.",
          },
        };
      }

      // Update user's friend list
      await userModel.findByIdAndUpdate(userId, {
        $addToSet: { friends: friendId },
      });
      await userModel.findByIdAndUpdate(friendId, {
        $addToSet: { friends: userId },
      });

      // Fetch updated friend details with user and friend data
      const friendDetails = await friendsModel
        .findById(updatedFriend._id)
        .populate("userId", "-password")
        .populate("friendId", "-password");

      return {
        success: true,
        message: "Friend request accepted successfully.",
        result: friendDetails,
      };
    } catch (err) {
      return {
        success: false,
        error: {
          statusCode: 500,
          message: err.message,
        },
      };
    }
  }
}
