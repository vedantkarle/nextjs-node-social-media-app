import React from "react";
import ChatContent from "./ChatContent";
import ChatList from "./ChatList";

const ChatBody = ({ user, chats, setChats, connectedUsers }) => {
	return (
		<div className='main__chatbody'>
			<ChatList
				chats={chats}
				setChats={setChats}
				connectedUsers={connectedUsers}
			/>
			<ChatContent />
		</div>
	);
};

export default ChatBody;
