import React from "react";

const CreatePostForm = () => {
	return (
		<form className='create-post'>
			<div className='profile-photo'>
				<img src='/profile.jfif' />
			</div>
			<input
				type='text'
				placeholder="What's on your mind, Vedant?"
				id='create-post'
			/>
			<input type='submit' value='Post' className='btn btn-primary' />
		</form>
	);
};

export default CreatePostForm;
