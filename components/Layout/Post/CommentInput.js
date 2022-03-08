import React, { useState } from "react";
import { addComment } from "../../../utils/postActions";

const CommentInput = ({ user, postId, setComments, setError }) => {
	const [text, setText] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async e => {
		e.preventDefault();
		setLoading(true);
		await addComment(postId, user, text, setComments, setText, setError);
		setLoading(false);
	};

	return (
		<form className='add-comment' onSubmit={handleSubmit}>
			<input
				type='text'
				placeholder='Add your comment'
				id='add-comment'
				value={text}
				onChange={e => setText(e.target.value)}
			/>
			<input
				type='submit'
				value={loading ? "Adding..." : "Add"}
				className='btn btn-primary'
				disabled={text === "" || loading}
			/>
		</form>
	);
};

export default CommentInput;
