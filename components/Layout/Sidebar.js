import Link from "next/link";
import React from "react";

const Sidebar = () => {
	return (
		<div className='left'>
			<Link href='/'>
				<a className='profile'>
					<div className='profile-photo'>
						<img src='/profile.jfif' />
					</div>
					<div className='handle'>
						<h4>Vedant Karle</h4>
						<p className='text-muted'>@vedant</p>
					</div>
				</a>
			</Link>
			<div className='sidebar'>
				<Link href='/'>
					<a className='menu-item active'>
						<span>
							<i className='uil uil-home'></i>
						</span>
						<h3>Home</h3>
					</a>
				</Link>
				<Link href='/'>
					<a className='menu-item'>
						<span>
							<i className='uil uil-envelopes'>
								<small className='notification-count'>9+</small>
							</i>
						</span>
						<h3>Messages</h3>
					</a>
				</Link>
				<Link href='/'>
					<a className='menu-item'>
						<span>
							<i className='uil uil-bell'>
								<small className='notification-count'>9+</small>
							</i>
						</span>
						<h3>Notifications</h3>
						<div className='notifications-popup'>
							<div>
								<div className='profile-photo'>
									<img src='/profile.jfif' />
								</div>
								<div className='notification-body'>
									<b>Jerome Wilson</b> accepted your friend request
									<small className='text-muted'>2 DAYS AGO</small>
								</div>
							</div>
							<div>
								<div className='profile-photo'>
									<img src='/profile.jfif' />
								</div>
								<div className='notification-body'>
									<b>Jerome Wilson</b> accepted your friend request
									<small className='text-muted'>2 DAYS AGO</small>
								</div>
							</div>
							<div>
								<div className='profile-photo'>
									<img src='/profile.jfif' />
								</div>
								<div className='notification-body'>
									<b>Jerome Wilson</b> accepted your friend request
									<small className='text-muted'>2 DAYS AGO</small>
								</div>
							</div>
						</div>
					</a>
				</Link>
				<Link href='/'>
					<a className='menu-item'>
						<span>
							<i className='uil uil-bell'></i>
						</span>
						<h3>Account</h3>
					</a>
				</Link>
				<Link href='/'>
					<a className='menu-item'>
						<span>
							<i className='uil uil-bell'></i>
						</span>
						<h3>Logout</h3>
					</a>
				</Link>
			</div>
			<label htmlFor='create-post' className='btn btn-primary'>
				Create Post
			</label>
		</div>
	);
};

export default Sidebar;
