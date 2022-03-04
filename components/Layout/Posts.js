import React from "react";
import CreatePostForm from "./CreatePostForm";
import Feed from "./Feed";

const Posts = () => {
	return (
		<div className='middle'>
			<CreatePostForm />
			<div className='feeds'>
				<Feed />
			</div>
		</div>
	);
};

export default Posts;
