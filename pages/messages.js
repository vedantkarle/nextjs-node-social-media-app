import axios from "axios";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import ChatBody from "../components/Layout/Chat/ChatBody";
import baseUrl from "../utils/baseUrl";
import getUserInfo from "../utils/getUserInfo";

const Messages = ({ chatsData, user }) => {
	const [chats, setChats] = useState(chatsData);
	const [connectedUsers, setConnectedUsers] = useState([]);
	const [messages, setMessages] = useState([]);
	const [bannerData, setBannerData] = useState({ name: "", profilePicUrl: "" });
	const [loading, setLoading] = useState(false);

	const router = useRouter();
	const socket = useRef();
	const openChatId = useRef("");

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

		return () => {
			if (socket.current) {
				socket.current.emit("disconnect");
				socket.current.off();
			}
		};
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
						prevChat.lastMessage.msg = newMsg.msg;
						prevChat.date = newMsg.date;

						return [...prev];
					});
				}
			});
		}
	}, []);

	const sendMsg = msg => {
		if (socket.current) {
			socket.current.emit("sendMsg", {
				userId: user._id,
				msgSendToUserId: openChatId.current,
				msg,
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
