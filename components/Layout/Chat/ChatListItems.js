import { useRouter } from "next/router";
import React from "react";
import Avatar from "./Avatar";

const ChatListItems = ({ animationDelay, chat, connectedUsers }) => {
	const router = useRouter();

	const isOnline =
		connectedUsers?.length > 0 &&
		connectedUsers.filter(user => user.userId === chat.messagesWith).length > 0;

	return (
		<div
			onClick={() =>
				router.push(`/messages?message=${chat.messagesWith}`, undefined, {
					shallow: true,
				})
			}
			style={{ animationDelay: `0.${animationDelay}s` }}
			className={`chatlist__item active`}>
			<Avatar
				image={chat?.profilePicUrl || "http://placehold.it/80x80"}
				isOnline={isOnline}
			/>

			<div className='userMeta'>
				<p>{chat?.name}</p>
				<span className='activeTime'>
					{chat?.lastMessage && chat?.lastMessage?.msg.length > 20
						? `${chat?.lastMessage?.msg.substring(0, 20)}...`
						: chat?.lastMessage?.msg}
				</span>
			</div>
		</div>
	);
};

export default ChatListItems;
