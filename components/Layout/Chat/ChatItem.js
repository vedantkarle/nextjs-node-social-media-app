import moment from "moment";
import React, { useState } from "react";
import Avatar from "./Avatar";

const ChatItem = ({ user, image, msg, messagesWith }) => {
	const [deleteIcon, showDeleteIcon] = useState(false);

	console.log(msg.sender);
	console.log(user._id);

	return (
		<div
			style={{ animationDelay: `0.8s` }}
			className={`chat__item ${user._id !== msg.sender ? "other" : "me"}`}>
			<div className='chat__item__content'>
				<div className='chat__msg'>{msg.msg}</div>
				<div className='chat__meta'>
					<span style={{ color: "crimson", cursor: "pointer" }}>
						{user._id === msg.sender && <i className='uil uil-trash-alt'></i>}
					</span>
					<span>{moment(msg.date).fromNow()}</span>
				</div>
			</div>
			<Avatar image={image} />
		</div>
	);
};

export default ChatItem;
