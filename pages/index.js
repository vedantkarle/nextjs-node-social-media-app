import axios from "axios";
import { parseCookies } from "nookies";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CreatePostForm from "../components/Layout/Post/CreatePostForm";
import Posts from "../components/Layout/Post/Posts";
import SearchBar from "../components/Layout/SearchBar";
import Sidebar from "../components/Layout/Sidebar";
import baseUrl from "../utils/baseUrl";

const Index = ({ user, postsData, errorLoading }) => {
	const [posts, setPosts] = useState(postsData);
	const [showToastr, setShowToastr] = useState(false);

	useEffect(() => {
		document.title = `Welcome, ${user.name.split(" ")[0]}`;
	}, []);

	useEffect(() => {
		if (showToastr) {
			toast.success("Post deleted successfully");
			setShowToastr(false);
		}
	}, [showToastr]);

	return (
		<main>
			<div className='container'>
				<Sidebar user={user} />
				<div className='middle'>
					<CreatePostForm
						user={user}
						setPosts={setPosts}
						setShowToastr={setShowToastr}
					/>
					{posts.length === 0 || errorLoading ? (
						<div>No Posts</div>
					) : (
						<Posts
							user={user}
							posts={posts}
							setPosts={setPosts}
							setShowToastr={setShowToastr}
						/>
					)}
				</div>
				<SearchBar />
			</div>
		</main>
	);
};

Index.getInitialProps = async ctx => {
	try {
		const { token } = parseCookies(ctx);

		const res = await axios.get(`${baseUrl}/api/posts`, {
			headers: { Authorization: token },
			params: { pageNumber: 1 },
		});

		return {
			postsData: res.data,
		};
	} catch (error) {
		return { errorLoading: true };
	}
};

export default Index;
