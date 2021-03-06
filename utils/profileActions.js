import axios from "axios";
import cookie from "js-cookie";
import baseUrl from "./baseUrl";
import catchErrors from "./catchErrors";

const Axios = axios.create({
	baseURL: `${baseUrl}/api/profile`,
	headers: {
		Authorization: cookie.get("token"),
	},
});

export const followUser = async (userToFollowId, setLoggedUserFollowStats) => {
	try {
		await Axios.post(`/follow/${userToFollowId}`);

		setLoggedUserFollowStats(prev => ({
			...prev,
			following: [...prev.following, { user: userToFollowId }],
		}));
	} catch (error) {
		console.error(error);
		alert(catchErrors(error));
	}
};

export const unFollowUser = async (
	userToUnfollowId,
	setLoggedUserFollowStats,
) => {
	try {
		await Axios.post(`/unfollow/${userToUnfollowId}`);

		setLoggedUserFollowStats(prev => ({
			...prev,
			following: prev.following.filter(
				following => following.user !== userToUnfollowId,
			),
		}));
	} catch (error) {
		console.error(error);
		alert(catchErrors(error));
	}
};

export const updatePassword = async (setSuccess, userPasswords) => {
	try {
		const { currentPassword, newPassword } = userPasswords;

		await Axios.post("/settings/password", { currentPassword, newPassword });
		setSuccess(true);
	} catch (error) {
		console.error(error);
		alert(catchErrors(error));
	}
};

export const toggleMessagePopup = async (
	popupSetting,
	setPopupSetting,
	setSuccess,
) => {
	try {
		await Axios.post("/settings/messagePopup");
		setPopupSetting(!popupSetting);
		setSuccess(true);
	} catch (error) {
		console.error(error);
		alert(catchErrors(error));
	}
};
