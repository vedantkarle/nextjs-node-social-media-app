import axios from "axios";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import React, { useEffect, useState } from "react";
import ChatBody from "../components/Layout/Chat/ChatBody";
import baseUrl from "../utils/baseUrl";

const Messages = ({ chatsData, user }) => {
	const [chats, setChats] = useState(chatsData);

	const router = useRouter();

	useEffect(() => {
		if (chats.length > 0 && !router.query.message) {
			router.push(`/messages?message=${chats[0].messagesWith}`, undefined, {
				shallow: true,
			});
		}
	}, []);

	return <ChatBody user={user} chats={chats} setChats={setChats} />;
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
