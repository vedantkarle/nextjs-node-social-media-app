import React from "react";
import ChatListItems from "./ChatListItems";
import ChatListSearch from "./ChatListSearch";

const ChatList = ({ chats }) => {
	return (
		<div className='main__chatlist'>
			<div className='chatList__search'>
				<ChatListSearch />
			</div>
			<div className='chatlist__heading'>
				<h2>Chats</h2>
			</div>
			<div className='chatlist__items'>
				{chats?.length > 0 ? (
					chats.map((item, index) => {
						return (
							<ChatListItems
								animationDelay={index + 1}
								key={index}
								chat={item}
							/>
						);
					})
				) : (
					<h4>No Chats</h4>
				)}
			</div>
		</div>
	);
};

export default ChatList;
