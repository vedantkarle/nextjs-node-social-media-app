import App from "next/app";
import "semantic-ui-css/semantic.min.css";
import Layout from "../components/Layout/Layout";

class MyApp extends App {
	render() {
		const { Component } = this.props;
		return (
			<Layout>
				<Component />
			</Layout>
		);
	}
}

export default MyApp;
