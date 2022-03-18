import moment from "moment";
import Link from "next/link";
import React, { useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import { AiOutlineComment, AiOutlineShareAlt } from "react-icons/ai";
import { BsFillHeartFill, BsHeart } from "react-icons/bs";
import Modal from "react-responsive-modal";
import {
	deleteComment,
	deletePost,
	likePost,
} from "../../../utils/postActions";
import CommentInput from "./CommentInput";
import ImageModal from "./ImageModal";
import LikeList from "./LikeList";
import NoImageModal from "./NoImageModal";

const Feed = ({ post, setPosts, user, setShowToastr, socket }) => {
	const [likes, setLikes] = useState(post.likes);
	const [comments, setComments] = useState(post.comments);
	const [error, setError] = useState(null);
	const [open, setOpen] = useState(false);
	const [showModal, setShowModal] = useState(false);

	const onOpenModal = () => setOpen(true);
	const onCloseModal = () => setOpen(false);

	const isLiked =
		likes.length > 0 && likes.filter(like => like.user === user._id).length > 0;

	const handleDelete = (commentId = "") => {
		confirmAlert({
			title: "Confirm to delete?",
			message: "Are you sure to do this.",
			buttons: [
				{
					label: "Yes",
					onClick: async () =>
						commentId !== ""
							? await deleteComment(post._id, commentId, setComments, setError)
							: await deletePost(post._id, setPosts, setShowToastr),
				},
				{
					label: "No",
				},
			],
		});
	};

	return (
		<div className='feed'>
			<div className='head'>
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
				{(user.role === "root" || post.user._id === user._id) && (
					<span className='delete' onClick={() => handleDelete()}>
						<i className='uil uil-trash-alt'></i>
					</span>
				)}
			</div>
			{post?.picUrl && (
				<div className='photo' onClick={() => setShowModal(true)}>
					<img src={post?.picUrl} />
				</div>
			)}
			<div className='text' onClick={() => setShowModal(true)}>
				<p>{post?.text}</p>
			</div>
			<div className='action-buttons'>
				{isLiked ? (
					<span
						style={{ display: "flex", alignItems: "center", width: "70px" }}>
						<BsFillHeartFill
							style={{
								color: "crimson",
								fontSize: "1.2rem",
							}}
							onClick={() => {
								if (socket.current) {
									socket.current.emit("likePost", {
										postId: post._id,
										userId: user._id,
										like: false,
									});

									socket.current.on("postLiked", () => {
										setLikes(prev =>
											prev.filter(like => like.user !== user._id),
										);
									});
								} else {
									likePost(post._id, user._id, setLikes, false, setError);
								}
							}}
						/>
						<span
							style={{ fontSize: "12px", marginLeft: "10px" }}
							onClick={onOpenModal}>
							{likes.length === 1
								? `${likes.length} like`
								: `${likes.length} likes`}
						</span>
					</span>
				) : (
					<span
						style={{ display: "flex", alignItems: "center", width: "70px" }}>
						<BsHeart
							style={{
								fontSize: "1.2rem",
							}}
							onClick={() => {
								if (socket.current) {
									socket.current.emit("likePost", {
										postId: post._id,
										userId: user._id,
										like: true,
									});

									socket.current.on("postLiked", () => {
										setLikes(prev => [...prev, { user: user._id }]);
									});
								} else {
									likePost(post._id, user._id, setLikes, true, setError);
								}
							}}
						/>
						<span
							style={{ fontSize: "12px", marginLeft: "10px" }}
							onClick={onOpenModal}>
							{likes.length === 1
								? `${likes.length} like`
								: `${likes.length} likes`}
						</span>
					</span>
				)}
				<span>
					<AiOutlineComment
						style={{
							fontSize: "1.3rem",
							marginLeft: "5px",
						}}
					/>
				</span>
				<span>
					<AiOutlineShareAlt
						style={{
							fontSize: "1.3rem",
							marginLeft: "5px",
						}}
					/>
				</span>
			</div>

			{comments.length > 0 &&
				comments.map(
					(c, i) =>
						i < 3 && (
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
						),
				)}
			{comments.length > 3 && (
				<div className='text-muted' onClick={() => setShowModal(true)}>
					View all {comments.length} comments
				</div>
			)}
			<CommentInput
				user={user}
				postId={post._id}
				setComments={setComments}
				setError={setError}
			/>
			<LikeList open={open} onCloseModal={onCloseModal} postId={post._id} />
			<Modal
				open={showModal}
				onClose={() => {
					setShowModal(false);
				}}
				center>
				{post.picUrl ? (
					<ImageModal
						post={post}
						user={user}
						comments={comments}
						setComments={setComments}
						handleDelete={handleDelete}
						setError={setError}
					/>
				) : (
					<NoImageModal
						post={post}
						user={user}
						comments={comments}
						setComments={setComments}
						handleDelete={handleDelete}
						setError={setError}
					/>
				)}
			</Modal>
		</div>
	);
};

export default Feed;
