import { useState } from "react";
import { updatePassword } from "../../../utils/profileActions";

const UpdatePassword = ({ setSuccess, setError }) => {
	const [userPasswords, setUserPasswords] = useState({
		currentPassword: "",
		newPassword: "",
	});
	const [showTypedPassword, setShowTypedPassword] = useState({
		field1: false,
		field2: false,
	});
	const [loading, setLoading] = useState(false);

	const { currentPassword, newPassword } = userPasswords;
	const { field1, field2 } = showTypedPassword;

	const handleChange = e => {
		const { name, value } = e.target;
		setUserPasswords(prev => ({ ...prev, [name]: value }));
	};

	return (
		<form
			className='update-password-form'
			onSubmit={async e => {
				e.preventDefault();
				setLoading(true);
				await updatePassword(setSuccess, userPasswords);
				setUserPasswords({
					currentPassword: "",
					newPassword: "",
				});
				setLoading(false);
			}}>
			<label>Current Password</label>
			<input
				type='password'
				name='currentPassword'
				placeholder='Enter your current password'
				value={currentPassword}
				onChange={handleChange}
				required
			/>
			<label>New Password</label>
			<input
				type='password'
				name='newPassword'
				placeholder='Enter new password'
				value={newPassword}
				onChange={handleChange}
				required
			/>
			<button
				style={{ width: "300px" }}
				className='btn btn-primary'
				type='submit'
				disabled={loading || currentPassword === "" || newPassword === ""}>
				Confirm
			</button>
		</form>
	);
};

export default UpdatePassword;
