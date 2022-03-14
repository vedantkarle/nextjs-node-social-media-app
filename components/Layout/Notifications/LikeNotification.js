import moment from "moment";
import Link from "next/link";
import React from "react";

const LikeNotification = ({ user, notification }) => {
	return (
		<div className='notification-container'>
			<img src={notification.user.profilePicUrl} />
			<div className='notification-data'>
				<Link href={`/${notification.user.username}`}>
					{notification.user.name}
				</Link>{" "}
				liked your <Link href={`/post/${notification.post._id}`}>post</Link>{" "}
				<span className='text-muted'>
					{moment(notification.date).fromNow()}
				</span>
			</div>
		</div>
	);
};

export default LikeNotification;
