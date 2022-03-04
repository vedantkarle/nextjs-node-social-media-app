import React, { useEffect } from "react";
import Posts from "../components/Layout/Posts";
import SearchBar from "../components/Layout/SearchBar";
import Sidebar from "../components/Layout/Sidebar";

const Index = ({ user, userFollowStats }) => {
	useEffect(() => {
		document.title = `Welcome, ${user.name.split(" ")[0]}`;
	}, []);

	return (
		<main>
			<div className='container'>
				<Sidebar />
				<Posts />
				<SearchBar />
			</div>
		</main>
	);
};

export default Index;
