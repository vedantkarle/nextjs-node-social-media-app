import moment from "moment";
import React, { useState } from "react";
import Avatar from "./Avatar";

const MessageNotificationModal = ({
	socket,
	showModal,
	newMsgReceived,
	user,
	sendMsg,
}) => {
	const [text, setText] = useState("");
	const [loading, setLoading] = useState(false);

	return (
		<div className='msg-notification-modal'>
			<span className='text-muted' style={{ padding: "10px", margin: "10px" }}>
				{newMsgReceived.senderName} just messaged you
			</span>
			<div style={{ animationDelay: `0.8s` }} className={`chat__item`}>
				<div className='chat__item__content'>
					<div className='chat__msg'>{newMsgReceived.msg}</div>
					<div className='chat__meta'>
						<span></span>
						<span>{moment(newMsgReceived.date).fromNow()}</span>
					</div>
				</div>
				<Avatar image={newMsgReceived.senderProfilePicUrl} />
			</div>
			<div className='sendNewMessage' style={{ width: "400px" }}>
				<form
					onSubmit={e => {
						e.preventDefault();
						setLoading(true);
						sendMsg(text);
						setText("");
						setLoading(false);
					}}
					style={{ width: "100%" }}>
					<input
						type='text'
						placeholder='Type a message here'
						value={text}
						onChange={e => setText(e.target.value)}
					/>
					<button
						className='btn btn-primary'
						id='sendMsgBtn'
						disabled={text === "" || loading}
						type='submit'>
						<i className='uil uil-message'></i>
					</button>
				</form>
			</div>
			<span className='text-muted'>
				You can change the message popup setting from settings
			</span>
		</div>
	);
};

export default MessageNotificationModal;
