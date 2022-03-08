import React from "react";
import CreatePostForm from "./CreatePostForm";
import Feed from "./Feed";

const Posts = ({ posts, user, setPosts, setShowToastr }) => {
	return (
		<div className='middle'>
			<CreatePostForm
				user={user}
				setPosts={setPosts}
				setShowToastr={setShowToastr}
			/>
			<div className='feeds'>
				{posts.map(post => (
					<Feed
						key={post._id}
						post={post}
						setPosts={setPosts}
						user={user}
						setShowToastr={setShowToastr}
					/>
				))}
			</div>
		</div>
	);
};

export default Posts;
