import { useRouter } from "next/router";
import React from "react";

function Navbar({ user }) {
	const router = useRouter();

	return (
		<nav>
			<div className='container'>
				<h2 className='logo'>Social Book</h2>
				<div className='search-bar'>
					<i className='uil uil-search'></i>
					<input type='search' placeholder='Search...' />
				</div>
				<div className='create'>
					<label className='btn btn-primary' htmlFor='create-post'>
						Create
					</label>
					<div className='profile-photo'>
						<img src={user?.profilePicUrl} alt='user-photo' />
					</div>
				</div>
			</div>
		</nav>
	);
}

export default Navbar;
