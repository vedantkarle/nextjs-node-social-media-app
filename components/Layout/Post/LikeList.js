import axios from "axios";
import cookie from "js-cookie";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Modal } from "react-responsive-modal";
import baseUrl from "../../../utils/baseUrl";
import catchErrors from "../../../utils/catchErrors";

const LikeList = ({ postId, trigger, open, onCloseModal }) => {
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
		getLikesList();
	}, []);

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
								minWidth: "210px",
							}}>
							{likesList?.map(like => (
								<div key={like._id}>
									<Link href={`/${like.user.username}`}>
										<a>{like.user.username}</a>
									</Link>
								</div>
							))}
						</div>
					)}
				</>
			)}
		</Modal>
	);
};

export default LikeList;
