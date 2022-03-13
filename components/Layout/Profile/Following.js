import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import baseUrl from "../../../utils/baseUrl";
import { followUser, unFollowUser } from "../../../utils/profileActions";

const Following = ({
	user,
	loggedUserFollowStats,
	setLoggedUserFollowStats,
	profileUserId,
}) => {
	const [following, setFollowing] = useState([]);
	const [loading, setLoading] = useState(false);
	const [followLoading, setFollowLoading] = useState(false);

	useEffect(() => {
		(async () => {
			setLoading(true);
			try {
				const res = await axios.get(
					`${baseUrl}/api/profile/following/${profileUserId}`,
					{
						headers: { Authorization: Cookies.get("token") },
					},
				);

				setFollowing(res.data);
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
				following.length > 0 &&
				following.map(following => {
					const isFollowing =
						loggedUserFollowStats.following.length > 0 &&
						loggedUserFollowStats.following.filter(
							f => f.user === following.user._id,
						).length > 0;

					const ownAccount = following.user._id === user._id;

					return (
						<div key={following?.user?._id} className='follow-list-item'>
							<div style={{ display: "flex", alignItems: "center" }}>
								<img src={following?.user?.profilePicUrl} />
								<span style={{ marginLeft: "10px" }}>
									{following?.user?.name}
								</span>
							</div>
							{!ownAccount && (
								<button
									onClick={async () => {
										setFollowLoading(true);
										isFollowing
											? await unFollowUser(
													following?.user?._id,
													setLoggedUserFollowStats,
											  )
											: await followUser(
													following?.user?._id,
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

export default Following;
