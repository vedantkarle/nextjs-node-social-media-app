import axios from "axios";
import Cookies from "js-cookie";
import baseUrl from "./baseUrl";

const getUserInfo = async userToFindId => {
	try {
		const res = await axios.get(`${baseUrl}/api/chats/user/${userToFindId}`, {
			headers: { Authorization: Cookies.get("token") },
		});
		console.log(res.data);
		return { name: res.data.name, profilePicUrl: res.data.profilePicUrl };
	} catch (error) {
		alert("Error looking for user");
	}
};

export default getUserInfo;
