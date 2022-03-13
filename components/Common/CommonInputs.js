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
				type='button'
				onClick={() => setShowSocialLinks(!showSocialLinks)}>
				Add Social Links
			</button>
			{showSocialLinks && (
				<>
					<Divider />
					<input name='facebook' value={facebook} onChange={handleChange} />
					<input name='twitter' value={twitter} onChange={handleChange} />
					<input name='instagram' value={instagram} onChange={handleChange} />
					<input name='youtube' value={youtube} onChange={handleChange} />

					<p>Social Media Links Are Optional</p>
				</>
			)}
		</>
	);
};

export default CommonInputs;
