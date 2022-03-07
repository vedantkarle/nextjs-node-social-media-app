const express = require("express");
const router = express.Router();
const User = require("../models/UserModel");
const Post = require("../models/PostModel");
const Follower = require("../models/FollowerModel");
const authMiddleware = require("../middlewares/authMiddleware");
const uuid = require("uuid").v4;

router.post("/", authMiddleware, async (req, res) => {
	const { text, location, picUrl } = req.body;

	if (text.trim().length < 1)
		return res.status(400).send("Text must be at least 1 character");

	try {
		const newPost = {
			user: req.userId,
			text,
		};
		if (location) newPost.location = location;
		if (picUrl) newPost.picUrl = picUrl;

		const post = await Post(newPost).save();

		res.status(201).json(post);
	} catch (error) {
		console.error(error);
		return res.status(500).send(`Server Error`);
	}
});

router.get("/", authMiddleware, async (req, res) => {
	try {
		const posts = await Post.find({})
			.sort({ createdAt: -1 })
			.populate("user")
			.populate("comments.user")
			.populate("likes.user");

		res.status(200).json(posts);
	} catch (error) {
		console.error(error);
		return res.status(500).send(`Server Error`);
	}
});

router.get("/:postId", authMiddleware, async (req, res) => {
	const { postId } = req.params;

	try {
		const post = await Post.findById(postId)
			.populate("user")
			.populate("comments.user");

		if (!post) {
			return res.status(404).send("Post not found!");
		}

		res.status(200).json(post);
	} catch (error) {
		console.error(error);
		return res.status(500).send(`Server Error`);
	}
});

router.delete("/:postId", authMiddleware, async (req, res) => {
	const { postId } = req.params;

	try {
		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).send("Post not found!");
		}

		const user = await User.findById(req.userId);

		if (post.user.toString() !== req.userId) {
			if (user.role === "root") {
				await post.remove();
				return res.status(204).send("Post deleted successfully");
			} else {
				return res.status(401).send("Unauthorized");
			}
		}

		await post.remove();
		return res.status(204).send("Post deleted successfully");
	} catch (error) {
		console.error(error);
		return res.status(500).send(`Server Error`);
	}
});

router.post("/like/:postId", authMiddleware, async (req, res) => {
	const { postId } = req.params;
	try {
		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).send("Post not found!");
		}

		const isLiked =
			post.likes.filter(like => like.user.toString() === req.userId).length > 0;

		if (isLiked) {
			const likes = post.likes.filter(
				like => like.user.toString() !== req.userId,
			);
			post.likes = likes;
			await post.save();
			return;
		}

		await post.likes.unshift({ user: req.userId });
		await post.save();

		res.status(200).send("Post liked");
	} catch (error) {
		console.error(error);
		return res.status(500).send(`Server Error`);
	}
});

router.post("/comment/:postId", authMiddleware, async (req, res) => {
	try {
		const { postId } = req.params;
		const { text } = req.body;

		if (text.trim().length < 1)
			return res.status(400).send("Comment should be atleast 1 character");

		const post = await Post.findById(postId);

		if (!post) return res.status(404).send("Post not found");

		const newComment = {
			_id: uuid(),
			text,
			user: req.userId,
			date: Date.now(),
		};

		await post.comments.unshift(newComment);
		await post.save();

		res.status(200).send("Comment added!");
	} catch (error) {
		console.error(error);
		return res.status(500).send(`Server Error`);
	}
});

router.delete("/:postId/:commentId", authMiddleware, async (req, res) => {
	try {
		const { postId, commentId } = req.params;

		const post = await Post.findById(postId);

		if (!post) return res.status(404).send("Post not found");

		const comment = post.comments.find(comment => comment._id === commentId);

		if (!comment) return res.status(404).send("Comment not found");

		const user = await User.findById(req.userId);

		if (comment.user.toString() !== req.userId) {
			if (user.role === "root") {
				const indexOf = post.comments
					.map(comment => comment._id)
					.indexOf(commentId);

				await post.comments.splice(indexOf, 1);

				return res.status(200).send("Comment deleted successfully");
			} else {
				return res.status(401).send("Unauthorized");
			}
		}

		const indexOf = post.comments
			.map(comment => comment._id)
			.indexOf(commentId);

		await post.comments.splice(indexOf, 1);

		return res.status(200).send("Comment deleted successfully");
	} catch (error) {
		console.error(error);
		return res.status(500).send(`Server Error`);
	}
});

module.exports = router;