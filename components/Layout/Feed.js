import React from "react";

const Feed = () => {
	return (
		<div className='feed'>
			<div className='head'>
				<div className='user'>
					<div className='profile-photo'>
						<img src='/profile.jfif' />
					</div>
					<div className='info'>
						<h3>Jerome Wilson</h3>
						<small>Dubai, 15 MINUTES AGO</small>
					</div>
				</div>
				<span className='edit'>
					<i className='uil uil-ellipsis-h'></i>
				</span>
			</div>
			<div className='photo'>
				<img src='/profile.jfif' />
			</div>
			<div className='action-buttons'>
				<div className='interaction-buttons'>
					<span>
						<i className='uil uil-heart'></i>
					</span>
					<span>
						<i className='uil uil-comment-dots'></i>
					</span>
					<span>
						<i className='uil uil-share-alt'></i>
					</span>
				</div>
			</div>
			<div className='liked-by'>
				<span>
					<img src='/profile.jfif' />
				</span>
				<span>
					<img src='/profile.jfif' />
				</span>
				<span>
					<img src='/profile.jfif' />
				</span>
				<p>
					Liked by <b>Vedant Karle</b> and <b>2,333 others</b>
				</p>
			</div>
			<div className='caption'>
				<p>
					<b>Vedant Karle</b> : This is a very very excellent photo
				</p>
			</div>
			<div className='text-muted'>View all 277 comments</div>
		</div>
	);
};

export default Feed;
