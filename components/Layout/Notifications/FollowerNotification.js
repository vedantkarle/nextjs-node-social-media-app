import moment from "moment";
import Link from "next/link";
import React, { useState } from "react";
import { followUser, unFollowUser } from "../../../utils/profileActions";

const FollowerNotification = ({
	notification,
	loggedUserFollowStats,
	setLoggedUserFollowStats,
}) => {
	const [disabled, setDisabled] = useState(false);

	const isFollowing =
		loggedUserFollowStats.following.length > 0 &&
		loggedUserFollowStats.following.filter(
			following => following.user === notification.user._id,
		).length > 0;

	return (
		<div className='notification-container'>
			<img src={notification.user.profilePicUrl} />
			<div className='notification-data'>
				<div>
					<Link href={`/${notification.user.username}`}>
						{notification.user.name}
					</Link>{" "}
					started following you{" "}
					<span className='text-muted'>
						{moment(notification.date).fromNow()}
					</span>
				</div>
				<span>{notification?.text}</span>
				<div style={{ position: "absolute", right: "5px", bottom: "5px" }}>
					<button
						onClick={async () => {
							setDisabled(true);
							isFollowing
								? await unFollowUser(
										notification.user._id,
										setLoggedUserFollowStats,
								  )
								: await followUser(
										notification.user._id,
										setLoggedUserFollowStats,
								  );
							setDisabled(false);
						}}
						className={isFollowing ? "btn" : "btn btn-primary"}
						disabled={disabled}>
						{isFollowing ? (
							<i className='uil uil-user-check'></i>
						) : (
							<i className='uil uil-user-plus'></i>
						)}{" "}
						{isFollowing ? "Following" : "Follow Back"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default FollowerNotification;
