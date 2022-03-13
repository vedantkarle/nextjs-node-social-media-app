import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import baseUrl from "../../../utils/baseUrl";
import { followUser, unFollowUser } from "../../../utils/profileActions";

const Followers = ({
	user,
	loggedUserFollowStats,
	setLoggedUserFollowStats,
	profileUserId,
}) => {
	const [followers, setFollowers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [followLoading, setFollowLoading] = useState(false);

	const ownAccount = profileUserId === user._id;

	useEffect(() => {
		(async () => {
			setLoading(true);
			try {
				const res = await axios.get(
					`${baseUrl}/api/profile/followers/${profileUserId}`,
					{
						headers: { Authorization: Cookies.get("token") },
					},
				);

				setFollowers(res.data);
			} catch (error) {
				console.error(error);
				alert("Error Loading Data");
			}
			setLoading(false);
		})();
	}, []);

	return (
		<div>
			{loading ? (
				<ClipLoader />
			) : (
				followers.length > 0 &&
				followers.map(follower => {
					const isFollowing =
						loggedUserFollowStats.following.length > 0 &&
						loggedUserFollowStats.following.filter(
							f => f.user === follower.user._id,
						).length > 0;

					return (
						<div key={follower?.user?._id} className='follow-list-item'>
							<div style={{ display: "flex", alignItems: "center" }}>
								<img src={follower?.user?.profilePicUrl} />
								<span style={{ marginLeft: "10px" }}>
									{follower?.user?.name}
								</span>
							</div>
							{!ownAccount && (
								<button
									onClick={async () => {
										setFollowLoading(true);
										isFollowing
											? await unFollowUser(
													follower?.user?._id,
													setLoggedUserFollowStats,
											  )
											: await followUser(
													follower?.user?._id,
													setLoggedUserFollowStats,
											  );
										setFollowLoading(false);
									}}
									className={isFollowing ? "btn" : "btn btn-primary"}
									disabled={followLoading}>
									{isFollowing ? (
										<i className='uil uil-user-check'></i>
									) : (
										<i className='uil uil-user-plus'></i>
									)}{" "}
									{isFollowing ? "Following" : "Follow"}
								</button>
							)}
						</div>
					);
				})
			)}
		</div>
	);
};

export default Followers;
