import axios from "axios";
import cookie from "js-cookie";
import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import baseUrl from "../../../utils/baseUrl";
import Feed from "./Feed";

const Posts = ({ posts, user, setPosts, setShowToastr, socket }) => {
	const [hasMore, setHasMore] = useState(true);
	const [pageNumber, setPageNumber] = useState(2);

	const fetchDataOnScroll = async () => {
		try {
			const res = await axios.get(`${baseUrl}/api/posts`, {
				headers: { Authorization: cookie.get("token") },
				params: { pageNumber },
			});

			if (res.data.length === 0) setHasMore(false);

			setPosts(prev => [...prev, ...res.data]);
			setPageNumber(prev => prev + 1);
		} catch (error) {
			alert("Error Fetching Posts");
		}
	};

	return (
		<div className='feeds'>
			<InfiniteScroll
				hasMore={hasMore}
				next={fetchDataOnScroll}
				loader={<div>Fetching...</div>}
				endMessage={<div>No More Posts</div>}
				dataLength={posts?.length}>
				{posts.map(post => (
					<Feed
						socket={socket}
						key={post._id}
						post={post}
						setPosts={setPosts}
						user={user}
						setShowToastr={setShowToastr}
					/>
				))}
			</InfiniteScroll>
		</div>
	);
};

export default Posts;
