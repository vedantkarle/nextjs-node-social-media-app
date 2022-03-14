const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const User = require("../models/UserModel");
const Profile = require("../models/ProfileModel");
const Follower = require("../models/FollowerModel");
const Post = require("../models/PostModel");

const bcrypt = require("bcryptjs");

const {
	newFollowerNotification,
	removeFollowerNotification,
} = require("../utilsServer/notificationActions");

router.get("/:username", authMiddleware, async (req, res) => {
	const { username } = req.params;

	try {
		const user = await User.findOne({ username: username.toLowerCase() });

		if (!user) {
			return res.status(404).send("User not found");
		}

		const profile = await Profile.findOne({ user: user._id }).populate("user");

		const profileFollowStats = await Follower.findOne({ user: user._id });

		res.status(200).json({
			profile,
			followersLength: profileFollowStats.followers.length,
			followingLength: profileFollowStats.following.length,
		});
	} catch (error) {
		console.error(error);
		res.status(500).send(`Server Error`);
	}
});

router.get("/posts/:username", authMiddleware, async (req, res) => {
	try {
		const { username } = req.params;

		const user = await User.findOne({ username: username?.toLowerCase() });

		if (!user) {
			return res.status(404).send("User not found");
		}

		const posts = await Post.find({ user: user._id })
			.sort({ createdAt: -1 })
			.populate("user")
			.populate("comments.user");

		res.status(200).json(posts);
	} catch (error) {
		console.error(error);
		res.status(500).send(`Server Error`);
	}
});

router.get("/followers/:userId", authMiddleware, async (req, res) => {
	const { userId } = req.params;

	try {
		const user = await Follower.findOne({ user: userId }).populate(
			"followers.user",
		);

		res.status(200).json(user.followers);
	} catch (error) {
		console.error(error);
		res.status(500).send(`Server Error`);
	}
});

router.get("/following/:userId", authMiddleware, async (req, res) => {
	const { userId } = req.params;

	try {
		const user = await Follower.findOne({ user: userId }).populate(
			"following.user",
		);

		res.status(200).json(user.following);
	} catch (error) {
		console.error(error);
		res.status(500).send(`Server Error`);
	}
});

router.post("/follow/:userToFollowId", authMiddleware, async (req, res) => {
	const { userId } = req;
	const { userToFollowId } = req.params;

	try {
		const user = await Follower.findOne({ user: userId });
		const userToFollow = await Follower.findOne({ user: userToFollowId });

		if (!user || !userToFollow) {
			return res.status(404).send("User not found");
		}

		const isFollowing =
			user.following.length > 0 &&
			user.following.filter(
				following => following.user.toString() === userToFollowId,
			).length > 0;

		if (isFollowing) {
			return res.status(401).send("User already followed");
		}

		await user.following.unshift({ user: userToFollowId });
		await user.save();

		await userToFollow.followers.unshift({ user: userId });
		await userToFollow.save();

		await newFollowerNotification(userId, userToFollowId);

		res.status(200).send("Success");
	} catch (error) {
		console.error(error);
		res.status(500).send(`Server Error`);
	}
});

router.post("/unfollow/:userToUnfollowId", authMiddleware, async (req, res) => {
	const { userId } = req;
	const { userToUnfollowId } = req.params;

	try {
		const user = await Follower.findOne({ user: userId });
		const userToUnFollow = await Follower.findOne({ user: userToUnfollowId });

		if (!user || !userToUnFollow) {
			return res.status(404).send("User not found");
		}

		const isFollowing =
			user.following.length > 0 &&
			user.following.filter(
				following => following.user.toString() === userToUnfollowId,
			).length > 0;

		if (!isFollowing) {
			return res.status(400).send("User already not followed!");
		}

		const removeFollowing = user.following
			.map(following => following.user.toString())
			.indexOf(userToUnfollowId);

		await user.following.splice(removeFollowing, 1);
		await user.save();

		const removeFollowers = userToUnFollow.followers
			.map(follower => follower.user.toString())
			.indexOf(userId);

		await userToUnFollow.followers.splice(removeFollowers, 1);
		await userToUnFollow.save();

		await removeFollowerNotification(userId, userToUnFollowId);

		res.status(200).send("Success");
	} catch (error) {
		console.error(error);
		res.status(500).send(`Server Error`);
	}
});

router.post("/update", authMiddleware, async (req, res) => {
	try {
		const { userId } = req;

		const { bio, facebook, youtube, twitter, instagram, profilePicUrl } =
			req.body.user;

		let profileFields = {};

		profileFields.user = userId;

		profileFields.bio = bio;

		profileFields.social = {};

		if (facebook) profileFields.social.facebook = facebook;
		if (youtube) profileFields.social.youtube = youtube;
		if (instagram) profileFields.social.instagram = instagram;
		if (twitter) profileFields.social.twitter = twitter;

		await Profile.findOneAndUpdate(
			{ user: userId },
			{ $set: profileFields },
			{ new: true },
		);

		if (profilePicUrl) {
			const user = await User.findById(userId);
			user.profilePicUrl = profilePicUrl;
			await user.save();
		}

		return res.status(200).send("success");
	} catch (error) {
		console.error(error);
		res.status(500).send(`Server Error`);
	}
});

router.post("/settings/password", authMiddleware, async (req, res) => {
	try {
		const { currentPassword, newPassword } = req.body;

		if (newPassword.length < 6)
			return res.status(400).send("Password must be at least 6 characters");

		const user = await User.findById(req.userId).select("+password");

		const isPasswordValid = await bcrypt.compare(
			currentPassword,
			user.password,
		);

		if (!isPasswordValid) return res.status(401).send("Invalid Password");

		user.password = await bcrypt.hash(newPassword, 10);
		await user.save();

		res.sendStatus(204);
	} catch (error) {
		console.error(error);
		res.status(500).send(`Server Error`);
	}
});

router.post("/settings/messagePopup", authMiddleware, async (req, res) => {
	try {
		const user = await User.findById(req.userId);

		if (user.newMessagePopup) {
			user.newMessagePopup = false;
		} else {
			user.newMessagePopup = true;
		}

		await user.save();

		res.status(200).send("Success");
	} catch (error) {
		console.error(error);
		res.status(500).send(`Server Error`);
	}
});

module.exports = router;
