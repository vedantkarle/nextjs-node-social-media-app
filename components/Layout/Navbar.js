import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Container, Icon, Menu } from "semantic-ui-react";

function Navbar() {
	const router = useRouter();

	const isActive = route => router.pathname === route;

	return (
		<Menu fluid borderless>
			<Container text>
				<Link href='/login'>
					<Menu.Item header active={isActive("/login")}>
						<Icon size='large' name='sign in' />
						Login
					</Menu.Item>
				</Link>
				<Link href='/signup'>
					<Menu.Item header active={isActive("/signup")}>
						<Icon size='large' name='signup' />
						Signup
					</Menu.Item>
				</Link>
			</Container>
		</Menu>
	);
}

export default Navbar;
