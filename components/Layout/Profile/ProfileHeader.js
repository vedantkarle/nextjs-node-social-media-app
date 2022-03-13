import { useState } from "react";
import { followUser, unFollowUser } from "../../../utils/profileActions";

const ProfileHeader = ({
	profile,
	ownAccount,
	loggedUserFollowStats,
	setLoggedUserFollowStats,
}) => {
	const [loading, setLoading] = useState(false);

	const isFollowing =
		loggedUserFollowStats.following.length > 0 &&
		loggedUserFollowStats.following.filter(
			following => following.user === profile.user._id,
		).length > 0;

	return (
		<div className='profile-header'>
			<div className='cover-photo'>
				<img src={profile.user.profilePicUrl} />
				<div className='profile-photo'>
					<img src={profile.user.profilePicUrl} />
				</div>
			</div>
			<div className='profile-info'>
				<div>
					<h2>{profile?.user?.name}</h2>
					<p className='text-muted'>{profile?.bio}</p>
				</div>
				{profile?.social ? (
					<div>
						<a href={`mailto:${profile?.user?.email}`}>
							<i className='uil uil-envelope'></i>
						</a>
						{profile?.social?.facebook && (
							<a href='/'>
								<i className='uil uil-facebook'></i>
							</a>
						)}
						{profile?.social?.instagram && (
							<a href='/'>
								<i className='uil uil-instagram-alt'></i>
							</a>
						)}
						{profile?.social?.youtube && (
							<a href='/'>
								<i className='uil uil-youtube'></i>
							</a>
						)}
						{profile?.social?.twitter && (
							<a href='/'>
								<i className='uil uil-twitter'></i>
							</a>
						)}
					</div>
				) : (
					<span>No Social Links</span>
				)}
			</div>
			{!ownAccount && (
				<div className='profile-follow'>
					<button
						onClick={async () => {
							setLoading(true);
							isFollowing
								? await unFollowUser(
										profile?.user?._id,
										setLoggedUserFollowStats,
								  )
								: await followUser(
										profile?.user?._id,
										setLoggedUserFollowStats,
								  );
							setLoading(false);
						}}
						className={isFollowing ? "btn" : "btn btn-primary"}
						disabled={loading}>
						{isFollowing ? (
							<i className='uil uil-user-check'></i>
						) : (
							<i className='uil uil-user-plus'></i>
						)}{" "}
						{isFollowing ? "Following" : "Follow"}
					</button>
					<button
						style={{ marginLeft: "10px" }}
						className='btn btn-primary'
						disabled={loading}>
						<i className='uil uil-envelope-add'></i>Message
					</button>
				</div>
			)}
		</div>
	);
};

export default ProfileHeader;
