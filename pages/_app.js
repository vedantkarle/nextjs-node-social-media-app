import axios from "axios";
import "cropperjs/dist/cropper.css";
import { destroyCookie, parseCookies } from "nookies";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-responsive-modal/styles.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "../components/Layout/Layout";
import { redirectUser } from "../utils/authUser";
import baseUrl from "../utils/baseUrl";

function MyApp({ Component, pageProps }) {
	return (
		<Layout {...pageProps}>
			<ToastContainer />

			<Component {...pageProps} />
		</Layout>
	);
}

MyApp.getInitialProps = async ({ Component, ctx }) => {
	const { token } = parseCookies(ctx);

	let pageProps = {};

	const protectedRoutes =
		ctx.pathname === "/" ||
		ctx.pathname === "/[username]" ||
		ctx.pathname === "/notifications" ||
		ctx.pathname === "/post/[postId]" ||
		ctx.pathname === "/messages" ||
		ctx.pathname === "/search";

	if (!token) {
		destroyCookie(ctx, "token");
		protectedRoutes && redirectUser(ctx, "/login");
	}
	//
	else {
		if (Component.getInitialProps) {
			pageProps = await Component.getInitialProps(ctx);
		}

		try {
			const res = await axios.get(`${baseUrl}/api/auth`, {
				headers: { Authorization: token },
			});

			const { user, userFollowStats } = res.data;

			if (user) !protectedRoutes && redirectUser(ctx, "/");

			pageProps.user = user;
			pageProps.userFollowStats = userFollowStats;
		} catch (error) {
			console.log(error);
			destroyCookie(ctx, "token");
			redirectUser(ctx, "/login");
		}
	}

	return { pageProps };
};

export default MyApp;
