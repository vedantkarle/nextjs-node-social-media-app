const express = require("express");
const app = express();
const server = require("http").Server(app);
const next = require("next");
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const io = require("socket.io")(server);
require("dotenv").config({ path: "./config.env" });
const connectDb = require("./utilsServer/connectDb");
const {
	addUser,
	removeUser,
	findConnectedUser,
} = require("./utilsServer/roomActions");
const {
	loadMessages,
	sendMsg,
	setMsgToUnread,
	deleteMsg,
} = require("./utilsServer/messageActions");
const { likeOrUnlike } = require("./utilsServer/likeUnlikePost");

const PORT = process.env.PORT || 3000;

app.use(express.json());
connectDb();

io.on("connection", socket => {
	socket.on("join", async ({ userId }) => {
		const users = await addUser(userId, socket.id);

		setInterval(() => {
			socket.emit("connectedUsers", {
				users: users.filter(user => user.userId !== userId),
			});
		}, 10000);
	});

	socket.on("likePost", async ({ postId, userId, like }) => {
		const { success, error, name, profilePicUrl, username, postByUserId } =
			await likeOrUnlike(postId, userId, like);
		if (success) {
			socket.emit("postLiked");

			if (postByUserId !== userId) {
				const receiverSocket = findConnectedUser(postByUserId);

				if (receiverSocket && like) {
					io.to(receiverSocket.socketId).emit("newNotificationReceived", {
						name,
						profilePicUrl,
						username,
						postId,
					});
				}
			}
		}
	});

	socket.on("loadMessages", async ({ userId, messagesWith }) => {
		const { chat, error } = await loadMessages(userId, messagesWith);
		if (!error) {
			socket.emit("messagesLoaded", { chat });
		} else {
			socket.emit("noChatFound");
		}
	});

	socket.on("sendMsg", async ({ userId, msgSendToUserId, msg }) => {
		const { newMsg, error } = await sendMsg(userId, msgSendToUserId, msg);

		const receiverSocket = findConnectedUser(msgSendToUserId);

		if (receiverSocket) {
			io.to(receiverSocket.socketId).emit("newMsgReceived", { newMsg });
		} else {
			await setMsgToUnread(msgSendToUserId);
		}

		if (!error) {
			socket.emit("msgSent", { newMsg });
		}
	});

	socket.on("deleteMsg", async ({ userId, messagesWith, messageId }) => {
		await deleteMsg(userId, messagesWith, messageId);

		socket.emit("msgDeleted");
	});
});

nextApp.prepare().then(() => {
	app.use("/api/signup", require("./api/signup"));
	app.use("/api/auth", require("./api/auth"));
	app.use("/api/search", require("./api/search"));
	app.use("/api/posts", require("./api/posts"));
	app.use("/api/profile", require("./api/profile"));
	app.use("/api/notifications", require("./api/notifications"));
	app.use("/api/chats", require("./api/chats"));

	app.all("*", (req, res) => handle(req, res));

	server.listen(PORT, err => {
		if (err) throw err;
		console.log(`Express Server running on ${PORT}`);
	});
});
