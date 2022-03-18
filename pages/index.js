import axios from "axios";
import { parseCookies } from "nookies";
import React, { useEffect, useRef, useState } from "react";
import Modal from "react-responsive-modal";
import { toast } from "react-toastify";
import io from "socket.io-client";
import MessageNotificationModal from "../components/Layout/Chat/MessageNotificationModal";
import NotificationPopup from "../components/Layout/Notifications/NotificationPopup";
import CreatePostForm from "../components/Layout/Post/CreatePostForm";
import Posts from "../components/Layout/Post/Posts";
import SearchBar from "../components/Layout/SearchBar";
import Sidebar from "../components/Layout/Sidebar";
import baseUrl from "../utils/baseUrl";
import getUserInfo from "../utils/getUserInfo";

const Index = ({ user, postsData, errorLoading, notifications }) => {
	const [posts, setPosts] = useState(postsData);
	const [showToastr, setShowToastr] = useState(false);
	const [newMsgReceived, setNewMsgReceived] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [newNotification, setNewNotification] = useState(null);
	const [notificationPopup, setNotificationPopup] = useState(false);

	const socket = useRef();

	useEffect(() => {
		if (!socket.current) {
			socket.current = io(baseUrl);
		}

		if (socket.current) {
			socket.current.emit("join", { userId: user._id });
			socket.current.on("newMsgReceived", async ({ newMsg }) => {
				const { name, profilePicUrl } = await getUserInfo(newMsg.sender);
				if (user.newMessagePopup) {
					setNewMsgReceived({
						...newMsg,
						senderName: name,
						senderProfilePicUrl: profilePicUrl,
					});
					setShowModal(true);
				}
			});
		}

		document.title = `Welcome, ${user.name.split(" ")[0]}`;
	}, []);

	useEffect(() => {
		if (showToastr) {
			toast.success("Post deleted successfully");
			setShowToastr(false);
		}
	}, [showToastr]);

	useEffect(() => {
		if (socket.current) {
			socket.current.on(
				"newNotificationReceived",
				({ name, profilePicUrl, username, postId }) => {
					setNewNotification({
						name,
						profilePicUrl,
						username,
						postId,
					});
					setNotificationPopup(true);
				},
			);
		}
	}, []);

	useEffect(() => {
		if (newNotification && notificationPopup) {
			toast(<NotificationPopup newNotification={newNotification} />);
		}
	}, [newNotification, notificationPopup]);

	const sendMsg = msg => {
		if (socket.current) {
			socket.current.emit("sendMsg", {
				userId: user._id,
				msgSendToUserId: newMsgReceived.sender,
				msg,
			});
		}
		setShowModal(false);
	};

	return (
		<main>
			<div className='container'>
				<Sidebar user={user} notifications={notifications?.length} />
				<div className='middle'>
					<CreatePostForm
						user={user}
						setPosts={setPosts}
						setShowToastr={setShowToastr}
					/>
					{posts.length === 0 || errorLoading ? (
						<div>No Posts</div>
					) : (
						<Posts
							socket={socket}
							user={user}
							posts={posts}
							setPosts={setPosts}
							setShowToastr={setShowToastr}
						/>
					)}
				</div>
				<SearchBar />
			</div>
			<Modal
				open={showModal}
				onClose={() => {
					setShowModal(false);
				}}
				center>
				<MessageNotificationModal
					socket={socket}
					showModal={showModal}
					newMsgReceived={newMsgReceived}
					user={user}
					sendMsg={sendMsg}
				/>
			</Modal>
		</main>
	);
};

Index.getInitialProps = async ctx => {
	try {
		const { token } = parseCookies(ctx);

		const res = await axios.get(`${baseUrl}/api/posts`, {
			headers: { Authorization: token },
			params: { pageNumber: 1 },
		});

		const { data } = await axios.get(`${baseUrl}/api/notifications`, {
			headers: { Authorization: token },
		});

		return {
			postsData: res.data,
			notifications: data,
		};
	} catch (error) {
		return { errorLoading: true };
	}
};

export default Index;
