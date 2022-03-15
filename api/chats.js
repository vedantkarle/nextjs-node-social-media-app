const express = require("express");
const router = express.Router();
const Chat = require("../models/ChatModel");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware, async (req, res) => {
	try {
		const { userId } = req;

		const user = await Chat.findOne({ user: userId }).populate(
			"chats.messagesWith",
		);

		let chatsToBeSent = [];

		if (user.chats.length > 0) {
			chatsToBeSent = user.chats.map(chat => ({
				messagesWith: chat.messagesWith._id,
				name: chat.messagesWith.name,
				profilePicUrl: chat.messagesWith.profilePicUrl,
				lastMessage: chat.messages[chat.messages.length - 1],
				date: chat.messages[chat.messages.length - 1].date,
			}));
		}

		res.status(200).json(chatsToBeSent);
	} catch (error) {
		console.error(error);
		return res.status(500).send(`Server Error`);
	}
});

module.exports = router;
