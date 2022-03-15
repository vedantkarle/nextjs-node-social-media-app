import React from "react";
import Avatar from "./Avatar";
import ChatItem from "./ChatItem";

const ChatContent = () => {
	const chat = [
		{
			key: 1,
			image:
				"https://pbs.twimg.com/profile_images/1116431270697766912/-NfnQHvh_400x400.jpg",
			type: "",
			msg: "Hi Tim, How are you?",
		},
		{
			key: 2,
			image:
				"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU",
			type: "other",
			msg: "I am fine.",
		},
		{
			key: 3,
			image:
				"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU",
			type: "other",
			msg: "What about you?",
		},
		{
			key: 4,
			image:
				"https://pbs.twimg.com/profile_images/1116431270697766912/-NfnQHvh_400x400.jpg",
			type: "",
			msg: "Awesome these days.",
		},
		{
			key: 5,
			image:
				"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU",
			type: "other",
			msg: "Finally. What's the plan?",
		},
		{
			key: 6,
			image:
				"https://pbs.twimg.com/profile_images/1116431270697766912/-NfnQHvh_400x400.jpg",
			type: "",
			msg: "what plan mate?",
		},
		{
			key: 7,
			image:
				"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU",
			type: "other",
			msg: "I'm taliking about the tutorial",
		},
	];

	return (
		<div className='main__chatcontent'>
			<div className='content__header'>
				<div className='blocks'>
					<div className='current-chatting-user'>
						<Avatar
							isOnline='active'
							image='https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU'
						/>
						<p>Tim Hover</p>
					</div>
				</div>

				<div className='blocks'>
					<div className='settings'>
						<button className='btn-nobg'>
							<i className='fa fa-cog'></i>
						</button>
					</div>
				</div>
			</div>
			<div className='content__body'>
				<div className='chat__items'>
					{chat.map((itm, index) => {
						return (
							<ChatItem
								animationDelay={index + 2}
								key={itm.key}
								user={itm.type ? itm.type : "me"}
								msg={itm.msg}
								image={itm.image}
							/>
						);
					})}
					{/* <div ref={messagesEndRef} /> */}
				</div>
			</div>
			<div className='content__footer'>
				<div className='sendNewMessage'>
					<input type='text' placeholder='Type a message here' />
					<button className='btnSendMsg' id='sendMsgBtn'>
						<i className='uil uil-message'></i>
					</button>
				</div>
			</div>
		</div>
	);
};

export default ChatContent;
