import axios from "axios";
import cookie from "js-cookie";
import Router from "next/router";
import baseUrl from "./baseUrl";
import catchErrors from "./catchErrors";

export const registerUser = async (user, profilePicUrl, setError) => {
	try {
		const { data } = await axios.post(`${baseUrl}/api/signup`, {
			user,
			profilePicUrl,
		});

		setToken(data);
	} catch (error) {
		setError(catchErrors(error));
	}
};

export const loginUser = async (user, setError, setLoading) => {
	setLoading(true);
	try {
		const { data } = await axios.post(`${baseUrl}/api/auth`, { user });

		setToken(data);
	} catch (error) {
		setError(catchErrors(error));
	}
};

const setToken = token => {
	cookie.set("token", token);
	Router.push("/");
};
