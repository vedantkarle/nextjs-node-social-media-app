import moment from "moment";
import Link from "next/link";
import React from "react";

const CommentNotification = ({ user, notification }) => {
	return (
		<div className='notification-container'>
			<img src={notification.user.profilePicUrl} />
			<div className='notification-data comment'>
				<div>
					<Link href={`/${notification.user.username}`}>
						{notification.user.name}
					</Link>{" "}
					comment on you{" "}
					<Link href={`/post/${notification.post._id}`}>post</Link>{" "}
					<span className='text-muted'>
						{moment(notification.date).fromNow()}
					</span>
				</div>
				<span>{notification?.text}</span>
			</div>
		</div>
	);
};

export default CommentNotification;
