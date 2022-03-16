const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const User = require("../models/UserModel");

router.get("/:query", authMiddleware, async (req, res) => {
	const { query } = req.params;
	const { userId } = req;

	if (query.length === 0) return;

	try {
		const results = await User.find({
			name: { $regex: query, $options: "i" },
		});

		const resultsToBeSent =
			results?.length > 0 &&
			results.filter(res => res._id.toString() !== userId);

		return res.status(200).json({ users: resultsToBeSent });
	} catch (error) {
		console.error(error);
		res.status(500).send("Server Error");
	}
});

module.exports = router;
