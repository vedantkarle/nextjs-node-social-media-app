const Chat = require("../models/ChatModel");
const User = require("../models/UserModel");

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

const setMsgToUnread = async userId => {
	try {
		const user = await User.findById(userId);

		if (!user.unreadMessage) {
			user.unreadMessage = true;
			await user.save();
		}

		return;
	} catch (error) {
		console.error(error);
	}
};

const deleteMsg = async (userId, messagesWith, messageId) => {
	try {
		const user = await Chat.findOne({ user: userId });

		const chat = user.chats.find(
			chat => chat.messagesWith.toString() === messagesWith,
		);

		if (!chat) {
			return;
		}

		const messageToDelete = chat.messages.find(
			message => message._id.toString() === messageId,
		);

		if (!messageToDelete) return;

		if (messageToDelete.sender.toString() !== userId) {
			return;
		}

		const indexOf = chat.messages
			.map(m => m._id.toString())
			.indexOf(messageToDelete._id.toString());

		await chat.messages.splice(indexOf, 1);

		await user.save();

		return { success: true };
	} catch (error) {
		console.error(error);
		return { success: false };
	}
};

module.exports = { loadMessages, sendMsg, setMsgToUnread, deleteMsg };
