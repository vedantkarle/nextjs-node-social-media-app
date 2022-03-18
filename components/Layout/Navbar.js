import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

function Navbar({ user }) {
	const router = useRouter();

	return (
		<nav>
			<div className='container'>
				<h2
					className='logo'
					onClick={() => router.push("/")}
					style={{ cursor: "pointer" }}>
					Social Book
				</h2>
				<div className='search-bar'>
					<i className='uil uil-search'></i>
					<input type='search' placeholder='Search...' />
				</div>
				<div className='create'>
					{user ? (
						<div className='profile-photo'>
							<img src={user?.profilePicUrl} alt='user-photo' />
						</div>
					) : (
						<>
							<Link href='/login'>
								<label className='btn '>Login</label>
							</Link>
							<Link href='/signup'>
								<label className='btn btn-primary'>Signup</label>
							</Link>
						</>
					)}
				</div>
			</div>
		</nav>
	);
}

export default Navbar;
