const User = require("../models/UserModel");
const Post = require("../models/PostModel");
const {
	newLikeNotification,
	removeLikeNotification,
} = require("../utilsServer/notificationActions");

const likeOrUnlike = async (postId, userId, like) => {
	try {
		const post = await Post.findById(postId);

		if (!post) return { error: "No post found" };

		if (like) {
			const isLiked =
				post.likes.filter(like => like.user.toString() === userId).length > 0;

			if (isLiked) return { error: "Post liked before" };

			post.likes.unshift({ user: userId });

			await post.save();

			if (post.user.toString() !== userId) {
				await newLikeNotification(userId, postId, post.user.toString());
			}
		} else {
			const isLiked =
				post.likes.filter(like => like.user.toString() === userId).length === 0;

			if (isLiked) return { error: "Post not liked before" };

			const indexOf = post.likes
				.map(like => like.user.toString())
				.indexOf(userId);

			post.likes.splice(indexOf, 1);

			await post.save();

			if (post.user.toString() !== userId) {
				await removeLikeNotification(userId, postId, post.user.toString());
			}
		}

		const user = await User.findById(userId);

		const { name, profilePicUrl, username } = user;

		return {
			success: true,
			name,
			profilePicUrl,
			username,
			postByUserId: post.user.toString(),
		};
	} catch (error) {
		return { error: "Server Error" };
	}
};

module.exports = { likeOrUnlike };
