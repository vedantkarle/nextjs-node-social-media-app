import axios from "axios";

const upload = async media => {
	try {
		const formData = new FormData();

		formData.append("file", media);
		formData.append("upload_preset", process.env.UPLOAD_PRESET);
		formData.append("cloud_name", process.env.CLOUD_NAME);

		const { data } = await axios.post(process.env.CLOUDINARY_URL, formData);

		return data.url;
	} catch (error) {
		return;
	}
};

export default upload;
