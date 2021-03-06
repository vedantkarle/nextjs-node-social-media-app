import React, { useEffect, useRef, useState } from "react";
import Modal from "react-responsive-modal";
import { toast } from "react-toastify";
import { addPost } from "../../../utils/postActions";
import upload from "../../../utils/uploadPicToCloudinary";
import CropImageModal from "./CropImageModal";

const CreatePostForm = ({ user, setPosts, setShowToastr }) => {
	const [newPost, setNewPost] = useState({ text: "", location: "" });
	const [loading, setLoading] = useState(false);
	const inputRef = useRef();

	const [error, setError] = useState(null);

	const [media, setMedia] = useState(null);
	const [mediaPreview, setMediaPreview] = useState(null);

	const [showModal, setShowModal] = useState(false);

	const handleChange = e => {
		const { name, value, files } = e.target;

		if (name === "media") {
			setMedia(files[0]);
			setMediaPreview(URL.createObjectURL(files[0]));
		}

		setNewPost(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async e => {
		e.preventDefault();
		setLoading(true);
		let picUrl;

		if (media !== null) {
			picUrl = await upload(media);
			if (!picUrl) {
				setLoading(false);
				return setError("Error uploading image");
			}
		}

		await addPost(
			newPost.text,
			newPost.location,
			picUrl,
			setPosts,
			setNewPost,
			setError,
		);

		setMedia(null);
		setMediaPreview(null);

		setLoading(false);
	};

	useEffect(() => {
		if (error) {
			toast.error(error);
		}
	}, [error]);

	return (
		<div className='create-post'>
			<h4>Create Post</h4>
			<form onSubmit={handleSubmit}>
				<div className='post-form'>
					<div className='profile-photo'>
						<img src='/profile.jfif' />
					</div>
					<input
						type='text'
						placeholder="What's on your mind, Vedant?"
						id='create-post'
						name='text'
						value={newPost.text}
						onChange={handleChange}
					/>
				</div>
				<div className='post-form'>
					<i className='uil uil-user-location'></i>
					<input
						type='text'
						placeholder='Add Location?'
						name='location'
						value={newPost.location}
						onChange={handleChange}
					/>
				</div>
				{media === null ? (
					<div>
						<input
							ref={inputRef}
							onChange={handleChange}
							name='media'
							style={{ display: "none" }}
							type='file'
							accept='image/*'
						/>
						<div
							className='btn btn-primary'
							style={{ marginTop: "15px", width: "100%", textAlign: "center" }}
							onClick={() => inputRef.current.click()}>
							<i className='uil uil-image-plus' style={{ color: "white" }}></i>
							<span>Add Photo</span>
						</div>
					</div>
				) : (
					<div className='post-image'>
						<img src={mediaPreview} alt='post-image' />

						<div
							onClick={() => {
								!loading && setMedia(null);
								!loading && setMediaPreview(null);
							}}
							className='btn btn-primary'
							style={{ marginTop: "15px", width: "100%", textAlign: "center" }}>
							<i className='uil uil-trash-alt' style={{ color: "white" }}></i>
							<span>Remove Image</span>
						</div>
						<div
							onClick={() => setShowModal(true)}
							className='btn btn-primary'
							style={{ marginTop: "15px", width: "100%", textAlign: "center" }}>
							<i className='uil uil-crop-alt' style={{ color: "white" }}></i>
							<span>Crop Image</span>
						</div>
					</div>
				)}
				<input
					style={{ marginTop: "10px" }}
					type='submit'
					value={loading ? "Posting..." : "Post"}
					className='btn btn-primary'
					disabled={newPost.text === "" || loading}
				/>
			</form>
			<Modal
				open={showModal}
				onClose={() => {
					setShowModal(false);
				}}
				center>
				<CropImageModal
					mediaPreview={mediaPreview}
					setMediaPreview={setMediaPreview}
					setMedia={setMedia}
					setShowModal={setShowModal}
				/>
			</Modal>
		</div>
	);
};

export default CreatePostForm;
