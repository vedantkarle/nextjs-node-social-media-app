import Router from "next/router";
import nprogress from "nprogress";
import React from "react";
import { Container } from "semantic-ui-react";
import HeadTags from "./HeadTags";
import Navbar from "./Navbar";

function Layout({ children }) {
	Router.onRouteChangeStart = () => nprogress.start();
	Router.onRouteChangeComplete = () => nprogress.done();
	Router.onRouteChangeError = () => nprogress.done();

	return (
		<>
			<HeadTags />

			<Navbar />

			<Container style={{ paddingTop: "1rem" }} text>
				{children}
			</Container>
		</>
	);
}

export default Layout;
