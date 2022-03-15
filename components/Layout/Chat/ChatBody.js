import React from "react";
import ChatContent from "./ChatContent";
import ChatList from "./ChatList";

const ChatBody = ({ user, chats, setChats }) => {
	return (
		<div className='main__chatbody'>
			<ChatList chats={chats} />
			<ChatContent />
		</div>
	);
};

export default ChatBody;
