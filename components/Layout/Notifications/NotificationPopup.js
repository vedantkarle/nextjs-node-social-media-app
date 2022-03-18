import Link from "next/link";
import React from "react";

const NotificationPopup = ({ newNotification }) => {
	return (
		<div className='notification-container popup'>
			<img src={newNotification.profilePicUrl} />
			<div className='notification-data'>
				<Link href={`/${newNotification.username}`}>
					{newNotification.name}
				</Link>{" "}
				liked your <Link href={`/post/${newNotification.postId}`}>post</Link>{" "}
			</div>
		</div>
	);
};

export default NotificationPopup;
