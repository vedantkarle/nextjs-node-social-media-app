import axios from "axios";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import ChatBody from "../components/Layout/Chat/ChatBody";
import baseUrl from "../utils/baseUrl";
import getUserInfo from "../utils/getUserInfo";
import newMsgSound from "../utils/newMsgSound";

const scrollDivToBottom = divRef => {
	divRef.current !== null &&
		divRef.current.scrollIntoView({ behaviour: "smooth" });
};

const Messages = ({ chatsData, user }) => {
	const [chats, setChats] = useState(chatsData);
	const [connectedUsers, setConnectedUsers] = useState([]);
	const [messages, setMessages] = useState([]);
	const [bannerData, setBannerData] = useState({ name: "", profilePicUrl: "" });
	const [loading, setLoading] = useState(false);

	const router = useRouter();
	const socket = useRef();
	const openChatId = useRef("");
	const divRef = useRef();

	useEffect(() => {
		if (!socket.current) {
			socket.current = io(baseUrl);
		}

		if (socket.current) {
			socket.current.emit("join", { userId: user?._id });

			socket.current.on("connectedUsers", ({ users }) => {
				users?.length > 0 && setConnectedUsers(users);
			});
		}

		if (chats.length > 0 && !router.query.message) {
			router.push(`/messages?message=${chats[0].messagesWith}`, undefined, {
				shallow: true,
			});
		}
	}, []);

	useEffect(() => {
		const loadMessages = () => {
			setLoading(true);

			socket.current.emit("loadMessages", {
				userId: user._id,
				messagesWith: router.query.message,
			});

			socket.current.on("messagesLoaded", ({ chat }) => {
				setMessages(chat.messages);
				setBannerData({
					name: chat.messagesWith.name,
					profilePicUrl: chat.messagesWith.profilePicUrl,
				});
				openChatId.current = chat.messagesWith._id;
				divRef.current && scrollDivToBottom(divRef);
			});

			socket.current.on("noChatFound", async () => {
				const { name, profilePicUrl } = await getUserInfo(router.query.message);
				setBannerData({ name, profilePicUrl });
				setMessages([]);
				openChatId.current = router.query.message;
			});

			setLoading(false);
		};

		if (socket.current && router.query.message) {
			loadMessages();
		}
	}, [router.query.message]);

	useEffect(() => {
		if (socket.current) {
			socket.current.on("msgSent", ({ newMsg }) => {
				if (newMsg.receiver === openChatId.current) {
					setMessages(prev => [...prev, newMsg]);

					setChats(prev => {
						const prevChat = prev.find(
							chat => chat.messagesWith === newMsg.receiver,
						);
						prevChat.lastMessage = { msg: newMsg.msg };
						prevChat.date = newMsg.date;

						return [...prev];
					});
				}
			});

			socket.current.on("newMsgReceived", async ({ newMsg }) => {
				let senderName;

				if (newMsg.sender === openChatId.current) {
					setMessages(prev => [...prev, newMsg]);
					setChats(prev => {
						const prevChat = prev.find(
							chat => chat.messagesWith === newMsg.sender,
						);
						prevChat.lastMessage = { msg: newMsg.msg };
						prevChat.date = newMsg.date;
						senderName = prevChat.name;

						return [...prev];
					});
				} else {
					const ifPreviouslyMessaged =
						chats.filter(chat => chat.messagesWith === newMsg.sender).lenght >
						0;

					if (ifPreviouslyMessaged) {
						setChats(prev => {
							const prevChat = prev.find(
								chat => chat.messagesWith === newMsg.sender,
							);
							prevChat.lastMessage = { msg: newMsg.msg };
							prevChat.date = newMsg.date;
							senderName = prevChat.name;

							return [...prev];
						});
					} else {
						const { name, profilePicUrl } = await getUserInfo(newMsg.sender);
						senderName = name;

						const newChat = {
							messagesWith: newMsg.sender,
							name,
							profilePicUrl,
							lastMessage: { msg: newMsg.msg },
							date: newMsg.date,
						};

						setChats(prev => [newChat, ...prev]);
					}
				}
				newMsgSound(senderName);
			});
		}
	}, []);

	useEffect(() => {
		messages.length > 0 && scrollDivToBottom(divRef);
	}, [messages]);

	const sendMsg = msg => {
		if (socket.current) {
			socket.current.emit("sendMsg", {
				userId: user._id,
				msgSendToUserId: openChatId.current,
				msg,
			});
		}
	};

	const deleteMsg = messageId => {
		if (socket.current) {
			socket.current.emit("deleteMsg", {
				userId: user._id,
				messagesWith: openChatId.current,
				messageId,
			});

			socket.current.on("msgDeleted", () => {
				setMessages(prev => prev.filter(m => m._id !== messageId));
			});
		}
	};

	return (
		<>
			{loading ? (
				<h4>Loading</h4>
			) : (
				<ChatBody
					user={user}
					chats={chats}
					setChats={setChats}
					connectedUsers={connectedUsers}
					messages={messages}
					bannerData={bannerData}
					loading={loading}
					socket={socket}
					messagesWith={openChatId.current}
					sendMsg={sendMsg}
					divRef={divRef}
					deleteMsg={deleteMsg}
				/>
			)}
		</>
	);
};

Messages.getInitialProps = async ctx => {
	try {
		const { token } = parseCookies(ctx);

		const { data } = await axios.get(`${baseUrl}/api/chats`, {
			headers: { Authorization: token },
		});

		return { chatsData: data };
	} catch (error) {
		return { errorLoading: true };
	}
};

export default Messages;
