import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Divider, Message } from "semantic-ui-react";
import CommonInputs from "../components/Common/CommonInputs";
import ImageDropDiv from "../components/Common/ImageDropDiv";
import { registerUser } from "../utils/authUser";
import baseUrl from "../utils/baseUrl";
import upload from "../utils/uploadPicToCloudinary";

let cancel;

export const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;

const Signup = () => {
	const [user, setUser] = useState({
		name: "",
		username: "",
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

	const handleSubmit = async e => {
		e.preventDefault();
		setFormLoading(true);
		let profilePicUrl;
		if (media !== null) {
			profilePicUrl = await upload(media);
		}
		if (media !== null && !profilePicUrl) {
			setFormLoading(false);
			return setError("Error uploading image");
		}

		await registerUser(user, profilePicUrl, setError);
		setFormLoading(false);
	};

	const handleChange = e => {
		const { name, value, files } = e.target;

		if (name === "media") {
			setMedia(files[0]);
			setMediaPreview(URL.createObjectURL(files[0]));
		}

		setUser(prev => ({ ...prev, [name]: value }));
	};

	const checkUsername = async () => {
		setUsernameLoading(true);
		try {
			cancel && cancel();

			const CancelToken = axios.CancelToken;

			const { data } = await axios.get(`${baseUrl}/api/signup/${username}`, {
				cancelToken: new CancelToken(canceler => (cancel = canceler)),
			});

			if (data === "OK") {
				setUsernameAvailable(true);
				setUser(prev => ({ ...prev, username }));
			}
		} catch (error) {
			setError("Username not available");
		}
		setUsernameLoading(false);
	};

	useEffect(() => {
		const isUser = Object.values({ name, email, password, bio }).every(item =>
			Boolean(item),
		);

		isUser ? setSubmitDisabled(false) : setSubmitDisabled(true);
	}, [user]);

	useEffect(() => {
		username === "" ? setUsernameAvailable(false) : checkUsername();
	}, [username]);

	return (
		<div className='signup-form'>
			<form onSubmit={handleSubmit}>
				{error && (
					<Message
						error
						header='Oops!'
						content={error}
						onDismiss={() => setError(null)}
					/>
				)}
				<div className='form-inputs'>
					<ImageDropDiv
						mediaPreview={mediaPreview}
						setMediaPreview={setMediaPreview}
						setMedia={setMedia}
						inputRef={inputRef}
						highlighted={highlighted}
						setHighlighted={setHighlighted}
						handleChange={handleChange}
					/>
					<input
						label='Name'
						placeholder='Name'
						name='name'
						value={name}
						onChange={handleChange}
						required
					/>
					<input
						label='Email'
						placeholder='Email'
						name='email'
						value={email}
						onChange={handleChange}
						type='email'
						required
					/>
					<input
						label='Password'
						placeholder='Password'
						name='password'
						value={password}
						onChange={handleChange}
						required
						type='password'
					/>
					<input
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
						required
						readOnly={usernameLoading}
					/>
					<CommonInputs
						user={user}
						showSocialLinks={showSocialLinks}
						setShowSocialLinks={setShowSocialLinks}
						handleChange={handleChange}
					/>
					<Divider hidden />
					<button
						className='btn btn-primary'
						type='submit'
						disabled={submitDisabled || !usernameAvailable}>
						Signup
					</button>
				</div>
			</form>
		</div>
	);
};

export default Signup;
