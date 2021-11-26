import { useEffect, useRef, useState } from "react";
import { Button, Divider, Form, Message, Segment } from "semantic-ui-react";
import CommonInputs from "../components/Common/CommonInputs";
import ImageDropDiv from "../components/Common/ImageDropDiv";
import {
	FooterMessage,
	HeaderMessage,
} from "../components/Common/WelcomeMessage";

export const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;

const Signup = () => {
	const [user, setUser] = useState({
		name: "",
		email: "",
		password: "",
		bio: "",
		facebook: "",
		youtube: "",
		twitter: "",
		instagram: "",
	});

	const { name, email, password, bio } = user;

	const [showSocialLinks, setShowSocialLinks] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState(null);
	const [formLoading, setFormLoading] = useState(false);
	const [submitDisabled, setSubmitDisabled] = useState(false);

	const [username, setUsername] = useState("");
	const [usernameLoading, setUsernameLoading] = useState(false);
	const [usernameAvailable, setUsernameAvailable] = useState(false);

	const [media, setMedia] = useState(null);
	const [mediaPreview, setMediaPreview] = useState(null);
	const [highlighted, setHighlighted] = useState(false);
	const inputRef = useRef();

	const handleSubmit = e => {};

	const handleChange = e => {
		const { name, value, files } = e.target;

		if (name === "media") {
			setMedia(files[0]);
			setMediaPreview(URL.createObjectURL(files[0]));
		}

		setUser(prev => ({ ...prev, [name]: value }));
	};

	useEffect(() => {
		const isUser = Object.values({ name, email, password, bio }).every(item =>
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
					<ImageDropDiv
						mediaPreview={mediaPreview}
						setMediaPreview={setMediaPreview}
						setMedia={setMedia}
						inputRef={inputRef}
						highlighted={highlighted}
						setHighlighted={setHighlighted}
						handleChange={handleChange}
					/>
					<Form.Input
						label='Name'
						placeholder='Name'
						name='name'
						value={name}
						onChange={handleChange}
						fluid
						icon='user'
						iconPosition='left'
						required
					/>
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
					<Form.Input
						loading={usernameLoading}
						error={!usernameAvailable}
						label='Username'
						placeholder='Username'
						value={username}
						onChange={e => {
							setUsername(e.target.value);
							if (regexUserName.test(e.target.value)) {
								setUsernameAvailable(true);
							} else {
								setUsernameAvailable(false);
							}
						}}
						fluid
						iconPosition='left'
						required
						icon={usernameAvailable ? "check" : "close"}
					/>
					<CommonInputs
						user={user}
						showSocialLinks={showSocialLinks}
						setShowSocialLinks={setShowSocialLinks}
						handleChange={handleChange}
					/>
					<Divider hidden />
					<Button
						color='orange'
						type='submit'
						content='Signup'
						disabled={submitDisabled || !usernameAvailable}
					/>
				</Segment>
			</Form>

			<FooterMessage />
		</>
	);
};

export default Signup;
