import { useRouter } from "next/router";
import React from "react";
import Avatar from "./Avatar";

const ChatListItems = ({ animationDelay, chat }) => {
	const router = useRouter();

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
				isOnline={true}
			/>

			<div className='userMeta'>
				<p>{chat?.name}</p>
				<span className='activeTime'>
					{chat?.lastMessage.msg.length > 20
						? `${chat.lastMessage.msg.substring(0, 20)}...`
						: chat?.lastMessage.msg}
				</span>
			</div>
		</div>
	);
};

export default ChatListItems;
