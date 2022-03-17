const User = require("../models/UserModel");
const Notification = require("../models/NotificationModel");

const setNotificationToUnread = async userId => {
	try {
		const user = await User.findById(userId);

		if (!user.unreadNotification) {
			user.unreadNotification = true;
			await user.save();
		}

		return;
	} catch (error) {
		console.error(error);
	}
};

const newLikeNotification = async (userId, postId, userToNotifyId) => {
	try {
		const userToNotify = await Notification.findOne({ user: userToNotifyId });

		const newNotification = {
			type: "newLike",
			user: userId,
			post: postId,
			date: Date.now(),
		};

		await userToNotify.notifications.unshift(newNotification);
		await userToNotify.save();

		await setNotificationToUnread(userToNotifyId);

		return;
	} catch (error) {
		console.error(error);
	}
};

const removeLikeNotification = async (userId, postId, userToNotifyId) => {
	try {
		await Notification.findOneAndUpdate(
			{ user: userToNotifyId },
			{
				$pull: {
					notifications: {
						type: "newLike",
						user: userId,
						post: postId,
					},
				},
			},
		);

		return;
	} catch (error) {
		console.error(error);
	}
};

const newCommentNotification = async (
	userId,
	postId,
	commentId,
	userToNotifyId,
	text,
) => {
	try {
		const userToNotify = await Notification.findOne({ user: userToNotifyId });

		const newNotification = {
			type: "newComment",
			user: userId,
			post: postId,
			commentId,
			text,
			date: Date.now(),
		};

		await userToNotify.notifications.unshift(newNotification);
		await userToNotify.save();

		await setNotificationToUnread(userToNotifyId);

		return;
	} catch (error) {
		console.error(error);
	}
};

const removeCommentNotification = async (
	userId,
	postId,
	commentId,
	userToNotifyId,
) => {
	try {
		await NotificationModel.findOneAndUpdate(
			{ user: userToNotifyId },
			{
				$pull: {
					notifications: {
						type: "newComment",
						user: userId,
						post: postId,
						commentId,
					},
				},
			},
		);

		return;
	} catch (error) {
		console.error(error);
	}
};

const newFollowerNotification = async (userId, userToNotifyId) => {
	try {
		const userToNotify = await Notification.findOne({ user: userToNotifyId });

		const newNotification = {
			type: "newFollower",
			user: userId,
			date: Date.now(),
		};

		await userToNotify.notifications.unshift(newNotification);
		await userToNotify.save();

		await setNotificationToUnread(userToNotifyId);

		return;
	} catch (error) {
		console.error(error);
	}
};

const removeFollowerNotification = async (userId, userToNotifyId) => {
	try {
		await Notification.findOneAndUpdate(
			{ user: userToNotifyId },
			{
				$pull: {
					notifications: {
						type: "newFollower",
						user: userId,
					},
				},
			},
		);

		return;
	} catch (error) {
		console.error(error);
	}
};

module.exports = {
	newLikeNotification,
	removeLikeNotification,
	newCommentNotification,
	removeCommentNotification,
	newFollowerNotification,
	removeFollowerNotification,
};
