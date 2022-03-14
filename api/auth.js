const express = require("express");
const router = express.Router();
const User = require("../models/UserModel");
const Notification = require("../models/NotificationModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const isEmail = require("validator/lib/isEmail");
const authMiddleware = require("../middlewares/authMiddleware");
const Follower = require("../models/FollowerModel");

router.get("/", authMiddleware, async (req, res) => {
	const { userId } = req;

	try {
		const user = await User.findById(userId);

		const userFollowStats = await Follower.findOne({ user: userId });

		return res.status(200).json({ user, userFollowStats });
	} catch (error) {
		console.error(error);
		res.status(401).send("Unauthorized");
	}
});

router.post("/", async (req, res) => {
	const { email, password } = req.body.user;

	if (!isEmail(email)) return res.status(401).send(`Invalid Email`);

	if (password.length < 6)
		return res.status(401).send(`Password must be atleast 6 characters!`);

	try {
		const user = await User.findOne({ email: email.toLowerCase() }).select(
			"+password",
		);

		if (!user) return res.status(401).send("Invalid credentials");

		const match = await bcrypt.compare(password, user.password);

		if (!match) return res.status(401).send("Invalid credentials");

		const notificationModel = await Notification.findOne({ user: user._id });

		if (!notificationModel) {
			await Notification.create({ user: user._id, notifications: [] });
		}

		const payload = { userId: user._id };

		jwt.sign(
			payload,
			process.env.JWT_SECRET,
			{ expiresIn: "1d" },
			(err, token) => {
				if (err) throw err;

				return res.status(200).json(token);
			},
		);
	} catch (error) {
		console.error(error);
		return res.status(500).send(`Server Error`);
	}
});

module.exports = router;
