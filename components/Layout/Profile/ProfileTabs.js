import React from "react";

const ProfileTabs = ({
	activeItem,
	handleItemClick,
	followersLength,
	followingLength,
	ownAccount,
	loggedUserFollowStats,
}) => {
	return (
		<div>
			<div className='tabs'>
				<div
					className={activeItem === "profile" ? "tab active" : "tab"}
					onClick={() => handleItemClick("profile")}>
					<i className='uil uil-user-circle'></i>Profile
				</div>
				{ownAccount ? (
					<>
						<div
							className={activeItem === "followers" ? "tab active" : "tab"}
							onClick={() => handleItemClick("followers")}>
							<i className='uil uil-users-alt'></i>
							{loggedUserFollowStats?.followers?.length} Followers
						</div>
						<div
							className={activeItem === "following" ? "tab active" : "tab"}
							onClick={() => handleItemClick("following")}>
							<i className='uil uil-user-check'></i>
							{loggedUserFollowStats?.following?.length} Following
						</div>
					</>
				) : (
					<>
						<div
							className={activeItem === "followers" ? "tab active" : "tab"}
							onClick={() => handleItemClick("followers")}>
							<i className='uil uil-users-alt'></i>
							{followersLength} Followers
						</div>
						<div
							className={activeItem === "following" ? "tab active" : "tab"}
							onClick={() => handleItemClick("following")}>
							<i className='uil uil-user-check'></i>
							{followingLength} Following
						</div>
					</>
				)}

				{ownAccount && (
					<>
						<div
							className={activeItem === "updateProfile" ? "tab active" : "tab"}
							onClick={() => handleItemClick("updateProfile")}>
							<i className='uil uil-edit'></i>Update Profile
						</div>
						<div
							className={activeItem === "settings" ? "tab active" : "tab"}
							onClick={() => handleItemClick("settings")}>
							<i className='uil uil-cog'></i>Settings
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default ProfileTabs;
