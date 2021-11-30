const express = require("express");
const router = express.Router();
const User = require("../models/UserModel");
const Follower = require("../models/FollowerModel");
const Profile = require("../models/ProfileModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const isEmail = require("validator/lib/isEmail");
const userPng =
	"https://res.cloudinary.com/indersingh/image/upload/v1593464618/App/user_mklcpl.png";
const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;

router.get("/:username", async (req, res) => {
	const { username } = req.params;

	try {
		if (username.length < 1) return res.status(401).send(`Invalid`);

		if (!regexUserName.test(username)) return res.status(401).send(`Invalid`);

		const user = await User.findOne({ username: username.toLowerCase() });

		if (user) return res.status(401).send("Username already taken");

		return res.status(200).send("OK");
	} catch (error) {
		console.error(error);
		return res.status(500).send(`Server Error`);
	}
});

router.post("/", async (req, res) => {
	const { name, email, password, bio, facebook, youtube, twitter, instagram } =
		req.body.user;

	if (!isEmail(email)) return res.status(401).send(`Invalid Email`);

	if (password.length < 6)
		return res.status(401).send(`Password must be atleast 6 characters!`);

	try {
		let user;

		user = await User.findOne({ email: email.toLowerCase() });

		if (user) return res.status(401).send("Invalid credentials");

		const hashedPassword = await bcrypt.hash(password, 10);

		user = await User.create({
			name,
			email: email.toLowerCase(),
			username: username.toLowerCase(),
			password: hashedPassword,
			profilePicUrl: req.body.profilePicUrl || userPng,
		});

		let profileFields = {};

		profileFields.user = user._id;

		profileFields.bio = bio;

		profileFields.social = {};

		if (facebook) profileFields.social.facebook = facebook;
		if (youtube) profileFields.social.youtube = youtube;
		if (instagram) profileFields.social.instagram = instagram;
		if (twitter) profileFields.social.twitter = twitter;

		await Profile.create(profileFields);

		await Follower.create({
			user: user._id,
			followers: [],
			following: [],
		});

		const payload = { userId: user._id };

		jwt.sign(
			payload,
			process.env.JWT_SECRET,
			{ expiresIn: "1d" },
			(err, token) => {
				if (err) throw err;

				res.status(200).json(token);
			},
		);
	} catch (error) {
		console.error(error);
		return res.status(500).send(`Server Error`);
	}
});

module.exports = router;
