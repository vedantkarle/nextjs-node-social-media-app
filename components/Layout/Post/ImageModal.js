import moment from "moment";
import Link from "next/link";
import React from "react";
import CommentInput from "./CommentInput";

const ImageModal = ({
	post,
	user,
	comments,
	setComments,
	handleDelete,
	setError,
}) => {
	return (
		<div className='image-modal'>
			<div className='post-image'>
				<img src={post?.picUrl} alt='post-image' />
			</div>
			<div className='post-info'>
				<div className='user'>
					<div className='profile-photo'>
						<img src={post?.user?.profilePicUrl} alt='postImage' />
					</div>
					<div className='info'>
						<Link href={`/${post?.user?.username}`}>
							<h3>{post?.user?.username}</h3>
						</Link>
						<small>
							{post?.location && `${post?.location} ,`}{" "}
							{moment(post?.createdAt).fromNow()}
						</small>
					</div>
				</div>
				<div className='post-comments'>
					<span style={{ fontSize: "12px" }} className='text-muted'>
						comments({comments?.length})
					</span>
					{comments.length > 0 &&
						comments.map((c, i) => (
							<div className='caption' key={i}>
								<span>
									<Link href={`/${c.user.username}`}>
										<b>{c.user.name}</b>
									</Link>
									: {c.text}
								</span>
								{(user.role === "root" || c.user._id === user._id) && (
									<span className='delete' onClick={() => handleDelete(c._id)}>
										<i className='uil uil-trash-alt'></i>
									</span>
								)}
							</div>
						))}
				</div>
				<CommentInput
					user={user}
					postId={post._id}
					setComments={setComments}
					setError={setError}
				/>
			</div>
		</div>
	);
};

export default ImageModal;
