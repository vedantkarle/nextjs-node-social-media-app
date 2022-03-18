import React, { useState } from "react";
import Cropper from "react-cropper";

const CropImageModal = ({
	mediaPreview,
	setMediaPreview,
	setMedia,
	setShowModal,
}) => {
	const [cropper, setCropper] = useState();

	const getCropData = () => {
		if (cropper) {
			setMedia(cropper.getCroppedCanvas().toDataURL());
			setMediaPreview(cropper.getCroppedCanvas().toDataURL());
			cropper.destroy();
		}
		setShowModal(false);
	};

	return (
		<div>
			<h2>Crop image before upload</h2>
			<div className='image-cropper-grid'>
				<div>
					<Cropper
						style={{ height: "400px", width: "100%" }}
						cropBoxResizable
						zoomable
						highlight
						responsive
						guides
						dragMode='move'
						initialAspectRatio={1}
						preview='.img-preview'
						src={mediaPreview}
						viewMode={1}
						minCropBoxHeight={100}
						minCropBoxWidth={10}
						background={false}
						autoCropArea={1}
						checkOrientation={false}
						onInitialized={cropper => setCropper(cropper)}
					/>
				</div>
				<div>
					<h2>Final Result</h2>
					<div>
						<div
							style={{
								width: "100%",
								height: "300px",
								display: "inline-block",
								padding: "10px",
								overflow: "hidden",
								boxSizing: "border-box",
							}}
							className='img-preview'
						/>
					</div>
				</div>
			</div>
			<br />
			<hr />
			<div className='cropper-actions'>
				<button
					className='btn btn-primary circular'
					onClick={() => cropper && cropper.reset()}>
					<i className='uil uil-redo'></i>
				</button>
				<button
					className='btn btn-primary circular'
					onClick={() => cropper && cropper.setDragMode("move")}>
					<i className='uil uil-expand-arrows'></i>
				</button>
				<button
					className='btn btn-primary circular'
					onClick={() => cropper && cropper.setDragMode("crop")}>
					<i className='uil uil-crop-alt'></i>
				</button>
				<button className='btn btn-primary' onClick={getCropData}>
					<i className='uil uil-crop-alt'></i>Crop Image
				</button>
			</div>
		</div>
	);
};

export default CropImageModal;
