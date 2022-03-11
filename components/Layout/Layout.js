import Router from "next/router";
import nprogress from "nprogress";
import React from "react";
import HeadTags from "./HeadTags";
import Navbar from "./Navbar";

function Layout({ children, user }) {
	Router.onRouteChangeStart = () => nprogress.start();
	Router.onRouteChangeComplete = () => nprogress.done();
	Router.onRouteChangeError = () => nprogress.done();

	return (
		<>
			<HeadTags />

			<Navbar user={user} />

			<div>{children}</div>
		</>
	);
}

export default Layout;
