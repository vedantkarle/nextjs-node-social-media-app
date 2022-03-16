import axios from "axios";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import ChatBody from "../components/Layout/Chat/ChatBody";
import baseUrl from "../utils/baseUrl";

const Messages = ({ chatsData, user }) => {
	const [chats, setChats] = useState(chatsData);
	const [connectedUsers, setConnectedUsers] = useState([]);

	const router = useRouter();
	const socket = useRef();

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

	return (
		<ChatBody
			user={user}
			chats={chats}
			setChats={setChats}
			connectedUsers={connectedUsers}
		/>
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
