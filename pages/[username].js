import axios from "axios";
import cookie from "js-cookie";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import Feed from "../components/Layout/Post/Feed";
import Followers from "../components/Layout/Profile/Followers";
import Following from "../components/Layout/Profile/Following";
import ProfileHeader from "../components/Layout/Profile/ProfileHeader";
import ProfileTabs from "../components/Layout/Profile/ProfileTabs";
import Settings from "../components/Layout/Profile/Settings";
import UpdateProfile from "../components/Layout/Profile/UpdateProfile";
import baseUrl from "../utils/baseUrl";

const ProfilePage = ({
	profile,
	followersLength,
	followingLength,
	errorLoading,
	user,
	userFollowStats,
}) => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [loggedUserFollowStats, setLoggedUserFollowStats] =
		useState(userFollowStats);
	const [activeItem, setActiveItem] = useState("profile");

	const handleItemClick = item => setActiveItem(item);

	const ownAccount = profile.user._id === user._id;

	const router = useRouter();

	const { username } = router.query;

	useEffect(() => {
		(async () => {
			setLoading(true);
			try {
				const token = cookie.get("token");

				const res = await axios.get(
					`${baseUrl}/api/profile/posts/${username}`,
					{ headers: { Authorization: token } },
				);

				setPosts(res.data);
			} catch (error) {
				console.error(error);
				alert("Error Loading Posts");
			}
			setLoading(false);
		})();
	}, [router.query.username]);

	if (errorLoading) return <div>No Profile</div>;

	return (
		<div className='user-profile'>
			<ProfileTabs
				activeItem={activeItem}
				handleItemClick={handleItemClick}
				followersLength={followersLength}
				followingLength={followingLength}
				ownAccount={ownAccount}
				loggedUserFollowStats={loggedUserFollowStats}
			/>
			<div className='tab-content'>
				{activeItem === "profile" && (
					<>
						<ProfileHeader
							profile={profile}
							ownAccount={ownAccount}
							loggedUserFollowStats={loggedUserFollowStats}
							setLoggedUserFollowStats={setLoggedUserFollowStats}
						/>
						{loading ? (
							<ClipLoader />
						) : (
							posts.length > 0 && (
								<div className='feeds profile-posts'>
									{posts.map(post => (
										<Feed
											post={post}
											key={post._id}
											user={user}
											setPosts={setPosts}
										/>
									))}
								</div>
							)
						)}
					</>
				)}
				{activeItem === "followers" && (
					<Followers
						user={user}
						loggedUserFollowStats={loggedUserFollowStats}
						setLoggedUserFollowStats={setLoggedUserFollowStats}
						profileUserId={profile?.user?._id}
						ownAccount={ownAccount}
					/>
				)}
				{activeItem === "following" && (
					<Following
						user={user}
						loggedUserFollowStats={loggedUserFollowStats}
						setLoggedUserFollowStats={setLoggedUserFollowStats}
						profileUserId={profile?.user?._id}
						ownAccount={ownAccount}
					/>
				)}
				{activeItem === "updateProfile" && <UpdateProfile profile={profile} />}
				{activeItem === "settings" && (
					<Settings newMessagePopup={user?.newMessagePopup} />
				)}
			</div>
		</div>
	);
};

ProfilePage.getInitialProps = async ctx => {
	try {
		const { username } = ctx.query;
		const { token } = parseCookies(ctx);

		const res = await axios.get(`${baseUrl}/api/profile/${username}`, {
			headers: { Authorization: token },
		});

		const { profile, followersLength, followingLength } = res.data;

		return { profile, followersLength, followingLength };
	} catch (error) {
		return { errorLoading: true };
	}
};

export default ProfilePage;
