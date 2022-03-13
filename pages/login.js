import cookie from "js-cookie";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Message } from "semantic-ui-react";
import { loginUser } from "../utils/authUser";

function Login() {
	const [user, setUser] = useState({
		email: "",
		password: "",
	});

	const { email, password } = user;
	const [showPassword, setShowPassword] = useState(false);
	const [errorMsg, setErrorMsg] = useState(null);
	const [formLoading, setFormLoading] = useState(false);
	const [submitDisabled, setSubmitDisabled] = useState(true);

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

	const handleSubmit = async e => {
		e.preventDefault();

		await loginUser(user, setErrorMsg, setFormLoading);
	};

	useEffect(() => {
		document.title = "Welcome Back";
		const userEmail = cookie.get("userEmail");
		if (userEmail) setUser(prev => ({ ...prev, email: userEmail }));
	}, []);

	return (
		<div className='signup-form'>
			<h2>Login</h2>
			<form onSubmit={handleSubmit}>
				{errorMsg !== null && (
					<Message
						error
						header='Oops!'
						content={errorMsg}
						onDismiss={() => setErrorMsg(null)}
					/>
				)}

				<div className='form-inputs'>
					<input
						required
						label='Email'
						placeholder='Email'
						name='email'
						value={email}
						onChange={handleChange}
						type='email'
					/>

					<input
						label='Password'
						placeholder='Password'
						name='password'
						value={password}
						onChange={handleChange}
						type='password'
						required
					/>

					<button
						className='btn btn-primary'
						type='submit'
						disabled={submitDisabled}>
						Login
					</button>
				</div>
			</form>
			<p>
				New here ? <Link href='/signup'>Signup</Link>
			</p>
		</div>
	);
}

export default Login;
