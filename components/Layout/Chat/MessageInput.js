import React, { useState } from "react";

const MessageInput = ({ sendMsg }) => {
	const [text, setText] = useState("");
	const [loading, setLoading] = useState(false);

	return (
		<div className='sendNewMessage'>
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
	);
};

export default MessageInput;
