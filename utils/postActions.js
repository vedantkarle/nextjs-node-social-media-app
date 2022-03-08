import axios from "axios";
import cookie from "js-cookie";
import baseUrl from "./baseUrl";
import catchErrors from "./catchErrors";

const Axios = axios.create({
	baseURL: `${baseUrl}/api/posts`,
	headers: {
		Authorization: cookie.get("token"),
	},
});

export const addPost = async (
	text,
	location,
	picUrl,
	setPosts,
	setNewPost,
	setError,
) => {
	try {
		const res = await Axios.post("/", { text, location, picUrl });

		setPosts(prev => [res.data, ...prev]);
		setNewPost({ text: "", location: "" });
	} catch (error) {
		const errMsg = catchErrors(error);
		setError(errMsg);
	}
};

export const deletePost = async (postId, setPosts, setShowToastr) => {
	try {
		await Axios.delete(`/${postId}`);
		setPosts(prev => prev.filter(p => p._id !== postId));
		setShowToastr(true);
	} catch (error) {
		const errMsg = catchErrors(error);
		setError(errMsg);
	}
};

export const likePost = async (
	postId,
	userId,
	setLikes,
	like = true,
	setError,
) => {
	try {
		if (like) {
			await Axios.post(`/like/${postId}`);
			setLikes(prev => [...prev, { user: userId }]);
		} else if (!like) {
			await Axios.post(`/like/${postId}`);
			setLikes(prev => prev.filter(l => l.user !== userId));
		}
	} catch (error) {
		const errMsg = catchErrors(error);
		setError(errMsg);
	}
};

export const addComment = async (
	postId,
	user,
	text,
	setComments,
	setText,
	setError,
) => {
	try {
		const res = await Axios.post(`/comment/${postId}`, { text });

		const newComment = {
			_id: res.data,
			user,
			text,
			date: Date.now(),
		};

		setComments(prev => [newComment, ...prev]);

		setText("");
	} catch (error) {
		const errMsg = catchErrors(error);
		setError(errMsg);
	}
};

export const deleteComment = async (
	postId,
	commentId,
	setComments,
	setError,
) => {
	try {
		await Axios.delete(`/${postId}/${commentId}`);
		setComments(prev => prev.filter(c => c._id !== commentId));
	} catch (error) {
		const errMsg = catchErrors(error);
		setError(errMsg);
	}
};
