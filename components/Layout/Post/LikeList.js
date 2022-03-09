import axios from "axios";
import cookie from "js-cookie";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Modal } from "react-responsive-modal";
import baseUrl from "../../../utils/baseUrl";
import catchErrors from "../../../utils/catchErrors";

const LikeList = ({ postId, open, onCloseModal }) => {
	const [likesList, setLikesList] = useState([]);
	const [loading, setLoading] = useState(false);

	const getLikesList = async () => {
		setLoading(true);
		try {
			const res = await axios.get(`${baseUrl}/api/posts/like/${postId}`, {
				headers: { Authorization: cookie.get("token") },
			});
			setLikesList(res.data);
		} catch (error) {
			alert(catchErrors(error));
		}
		setLoading(false);
	};

	useEffect(() => {
		if (open) {
			getLikesList();
		}
	}, [open]);

	return (
		<Modal
			open={open}
			onClose={() => {
				setLikesList([]);
				onCloseModal();
			}}
			center>
			{loading ? (
				<>Loading...</>
			) : (
				<>
					{likesList?.length > 0 && (
						<div
							style={{
								overflow: "auto",
								maxHeight: "15rem",
								height: "15rem",
								minWidth: "300px",
							}}>
							{likesList?.map((like, i) => (
								<Link href={`/${like.user.username}`} key={i}>
									<a
										style={{
											display: "flex",
											marginBottom: "10px",
											alignItems: "center",
											width: "100%",
										}}>
										<div className='profile-photo'>
											<img src={like?.user?.profilePicUrl} />
										</div>
										<div className='handle' style={{ marginLeft: "10px" }}>
											<h4>{like.user.name}</h4>
											<p className='text-muted'>@{like?.user.username}</p>
										</div>
									</a>
								</Link>
							))}
						</div>
					)}
				</>
			)}
		</Modal>
	);
};

export default LikeList;
