const Chat = require("../models/ChatModel");

const loadMessages = async (userId, messagesWith) => {
	try {
		const user = await Chat.findOne({ user: userId }).populate(
			"chats.messagesWith",
		);

		const chat = user.chats.find(
			chat => chat.messagesWith._id.toString() === messagesWith,
		);

		if (!chat) return { error: "No chat Found" };

		return { chat };
	} catch (error) {
		console.error(error);
		return { error };
	}
};

const sendMsg = async (userId, msgSendToUserId, msg) => {
	try {
		const user = await Chat.findOne({ user: userId });

		const msgSendToUser = await Chat.findOne({ user: msgSendToUserId });

		const newMsg = {
			sender: userId,
			receiver: msgSendToUserId,
			msg,
			date: Date.now(),
		};

		const prevChat = user.chats.find(
			chat => chat.messagesWith.toString() === msgSendToUserId,
		);

		if (prevChat) {
			prevChat.messages.push(newMsg);
			await user.save();
		} else {
			const newChat = {
				messagesWith: msgSendToUserId,
				messages: [newMsg],
			};

			user.chats.unshift(newChat);
			await user.save();
		}

		const prevChatForReciver = msgSendToUser.chats.find(
			chat => chat.messagesWith.toString() === userId,
		);

		if (prevChatForReciver) {
			prevChatForReciver.messages.push(newMsg);
			await msgSendToUser.save();
		} else {
			const newChat = {
				messagesWith: userId,
				messages: [newMsg],
			};

			msgSendToUser.chats.unshift(newChat);
			await msgSendToUser.save();
		}

		return { newMsg };
	} catch (error) {
		console.error(error);
		return { error };
	}
};

module.exports = { loadMessages, sendMsg };
