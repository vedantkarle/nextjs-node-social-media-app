import React from "react";

const Avatar = ({ image, isOnline }) => {
	return (
		<div className='avatar'>
			<div className='avatar-img'>
				<img src={image} alt='#' />
			</div>
			<span className={`isOnline ${isOnline}`}></span>
		</div>
	);
};

export default Avatar;
