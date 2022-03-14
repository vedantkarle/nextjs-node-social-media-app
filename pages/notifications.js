import axios from "axios";
import cookie from "js-cookie";
import { parseCookies } from "nookies";
import React, { useEffect, useState } from "react";
import CommentNotification from "../components/Layout/Notifications/CommentNotification";
import FollowerNotification from "../components/Layout/Notifications/FollowerNotification";
import LikeNotification from "../components/Layout/Notifications/LikeNotification";
import baseUrl from "../utils/baseUrl";

const Notifications = ({
	notifications,
	errorLoading,
	user,
	userFollowStats,
}) => {
	const [loggedUserFollowStats, setLoggedUserFollowStats] =
		useState(userFollowStats);

	useEffect(() => {
		(async () => {
			try {
				await axios.post(
					`${baseUrl}/api/notifications`,
					{},
					{ headers: { Authorization: cookie.get("token") } },
				);
			} catch (error) {
				console.error(error);
			}
		})();
	}, []);

	return (
		<div className='container' style={{ marginTop: "62px" }}>
			<h2 className='notifications-title'>
				<i className='uil uil-bell'></i>
				Notifications
			</h2>
			{notifications?.length > 0 ? (
				<div
					style={{
						maxHeight: "40rem",
						overflow: "auto",
						height: "40rem",
					}}>
					<div>
						{notifications?.map(n => (
							<>
								{n.type === "newLike" && n.post !== null && (
									<LikeNotification user={user} notification={n} />
								)}
								{n.type === "newComment" && n.post !== null && (
									<CommentNotification user={user} notification={n} />
								)}
								{n.type === "newFollower" && (
									<FollowerNotification
										notification={n}
										loggedUserFollowStats={loggedUserFollowStats}
										setLoggedUserFollowStats={setLoggedUserFollowStats}
									/>
								)}
							</>
						))}
					</div>
				</div>
			) : (
				<h2 style={{ textAlign: "center" }}>No Notifications</h2>
			)}
		</div>
	);
};

Notifications.getInitialProps = async ctx => {
	try {
		const { token } = parseCookies(ctx);

		const { data } = await axios.get(`${baseUrl}/api/notifications`, {
			headers: { Authorization: token },
		});

		return { notifications: data };
	} catch (error) {
		return { errorLoading: true };
	}
};

export default Notifications;
