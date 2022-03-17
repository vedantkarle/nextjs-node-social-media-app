import { useRouter } from "next/router";
import React from "react";
import ChatContent from "./ChatContent";
import ChatList from "./ChatList";

const ChatBody = ({
	user,
	chats,
	setChats,
	connectedUsers,
	messages,
	bannerData,
	loading,
	socket,
	messagesWith,
	sendMsg,
	divRef,
	deleteMsg,
}) => {
	const router = useRouter();

	return (
		<div className='main__chatbody'>
			<ChatList
				chats={chats}
				setChats={setChats}
				connectedUsers={connectedUsers}
			/>
			{router.query.message && (
				<ChatContent
					divRef={divRef}
					messages={messages}
					bannerData={bannerData}
					user={user}
					loading={loading}
					socket={socket}
					messagesWith={messagesWith}
					sendMsg={sendMsg}
					deleteMsg={deleteMsg}
				/>
			)}
		</div>
	);
};

export default ChatBody;
