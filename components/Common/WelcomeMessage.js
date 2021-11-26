import Link from "next/link";
import { useRouter } from "next/router";
import { Divider, Icon, Message } from "semantic-ui-react";

export const HeaderMessage = () => {
	const router = useRouter();

	const signUpRoute = router.pathname === "/signup";

	return (
		<Message
			color='teal'
			attached
			header={signUpRoute ? "Get Started" : "Welcome Back"}
			icon={signUpRoute ? "settings" : "privacy"}
			content={
				signUpRoute ? "Create new Account" : "Login with email and password"
			}
		/>
	);
};

export const FooterMessage = () => {
	const router = useRouter();

	const signUpRoute = router.pathname === "/signup";

	return (
		<>
			{signUpRoute ? (
				<>
					<Message attached='bottom' warning>
						<Icon name='help' />
						Existing User? <Link href='/login'>Login</Link>
					</Message>
					<Divider hidden />
				</>
			) : (
				<>
					<Message attached='bottom' info>
						<Icon name='lock' />
						<Link href='/reset'>Forgot Password</Link>
					</Message>
					<Message attached='bottom' warning>
						<Icon name='help' />
						New User? <Link href='/signup'>Signup</Link>
					</Message>
					<Divider hidden />
				</>
			)}
		</>
	);
};
