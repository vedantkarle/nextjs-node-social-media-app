import { useEffect, useState } from "react";
import { Button, Divider, Form, Message, Segment } from "semantic-ui-react";
import {
	FooterMessage,
	HeaderMessage,
} from "../components/Common/WelcomeMessage";

const Login = () => {
	const [user, setUser] = useState({
		email: "",
		password: "",
	});

	const { email, password } = user;

	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState(null);
	const [formLoading, setFormLoading] = useState(false);
	const [submitDisabled, setSubmitDisabled] = useState(false);

	const handleSubmit = e => {};

	const handleChange = e => {
		const { name, value } = e.target;

		setUser(prev => ({ ...prev, [name]: value }));
	};

	useEffect(() => {
		const isUser = Object.values({ email, password }).every(item =>
			Boolean(item),
		);

		isUser ? setSubmitDisabled(false) : setSubmitDisabled(true);
	}, [user]);

	return (
		<>
			<HeaderMessage />

			<Form
				loading={formLoading}
				error={error !== null}
				onSubmit={handleSubmit}>
				<Message
					error
					header='Oops!'
					content={error}
					onDismiss={() => setError(null)}
				/>
				<Segment>
					<Form.Input
						label='Email'
						placeholder='Email'
						name='email'
						value={email}
						onChange={handleChange}
						fluid
						icon='envelope'
						iconPosition='left'
						type='email'
						required
					/>
					<Form.Input
						label='Password'
						placeholder='Password'
						name='password'
						value={password}
						onChange={handleChange}
						fluid
						icon={{
							name: "eye",
							circular: true,
							link: true,
							onClick: () => setShowPassword(!showPassword),
						}}
						iconPosition='left'
						required
						type={showPassword ? "text" : "password"}
					/>
					<Divider hidden />
					<Button
						icon='signup'
						color='orange'
						type='submit'
						content='Login'
						disabled={submitDisabled}
					/>
				</Segment>
			</Form>

			<FooterMessage />
		</>
	);
};

export default Login;
