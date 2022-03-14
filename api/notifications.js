const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const User = require("../models/UserModel");
const Notification = require("../models/NotificationModel");
const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
	try {
		const { userId } = req;

		const user = await Notification.findOne({ user: userId })
			.populate("notifications.user")
			.populate("notifications.post");

		res.status(200).json(user.notifications);
	} catch (error) {
		console.error(error);
		return res.status(500).send(`Server Error`);
	}
});

router.post("/", authMiddleware, async (req, res) => {
	try {
		const { userId } = req;

		const user = await User.findById(userId);

		if (user.unreadNotification) {
			user.unreadNotification = false;
			await user.save();
		}

		res.status(200).send("Updated");
	} catch (error) {
		console.error(error);
		return res.status(500).send(`Server Error`);
	}
});

module.exports = router;
