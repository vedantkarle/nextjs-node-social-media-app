import React from "react";
import ClipLoader from "react-spinners/ClipLoader";
import Avatar from "./Avatar";
import ChatItem from "./ChatItem";
import MessageInput from "./MessageInput";

const ChatContent = ({
	messages,
	bannerData,
	user,
	loading,
	socket,
	messagesWith,
	sendMsg,
}) => {
	return (
		<div className='main__chatcontent'>
			<div className='content__header'>
				<div className='blocks'>
					<div className='current-chatting-user'>
						<Avatar isOnline='active' image={bannerData?.profilePicUrl} />
						<p>{bannerData?.name}</p>
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
					{loading ? (
						<ClipLoader />
					) : (
						messages?.length > 0 &&
						messages?.map((m, index) => {
							return (
								<ChatItem
									animationDelay={index + 2}
									key={index}
									user={user}
									msg={m}
									image={bannerData.profilePicUrl}
									messagesWith={messagesWith}
								/>
							);
						})
					)}
				</div>
			</div>
			<div className='content__footer'>
				<MessageInput sendMsg={sendMsg} />
			</div>
		</div>
	);
};

export default ChatContent;
