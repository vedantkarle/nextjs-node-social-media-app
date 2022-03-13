import React from "react";
import { Divider } from "semantic-ui-react";

const CommonInputs = ({
	user: { bio, facebook, instagram, youtube, twitter },
	handleChange,
	showSocialLinks,
	setShowSocialLinks,
}) => {
	return (
		<>
			<textarea
				required
				name='bio'
				value={bio}
				onChange={handleChange}
				placeholder='Bio'></textarea>
			<button
				className='btn btn-primary'
				type='button'
				onClick={() => setShowSocialLinks(!showSocialLinks)}>
				Add Social Links
			</button>
			{showSocialLinks && (
				<>
					<Divider />
					<input
						placeholder='Facebook'
						name='facebook'
						value={facebook}
						onChange={handleChange}
					/>
					<input
						placeholder='Twitter'
						name='twitter'
						value={twitter}
						onChange={handleChange}
					/>
					<input
						placeholder='Instagram'
						name='instagram'
						value={instagram}
						onChange={handleChange}
					/>
					<input
						placeholder='Youtube'
						name='youtube'
						value={youtube}
						onChange={handleChange}
					/>

					<p>Social Media Links Are Optional</p>
				</>
			)}
		</>
	);
};

export default CommonInputs;
