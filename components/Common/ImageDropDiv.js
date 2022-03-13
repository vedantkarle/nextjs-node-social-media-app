import React from "react";

const ImageDropDiv = ({
	setHighlighted,
	inputRef,
	handleChange,
	mediaPreview,
	setMediaPreview,
	setMedia,
}) => {
	return (
		<>
			<div>
				<input
					style={{ display: "none" }}
					type='file'
					accept='image/*'
					onChange={handleChange}
					name='media'
					ref={inputRef}
				/>

				<div
					onDragOver={e => {
						e.preventDefault();
						setHighlighted(true);
					}}
					onDragLeave={e => {
						e.preventDefault();
						setHighlighted(false);
					}}
					onDrop={e => {
						e.preventDefault();
						setHighlighted(true);

						const droppedFile = Array.from(e.dataTransfer.files);
						setMedia(droppedFile[0]);
						setMediaPreview(URL.createObjectURL(droppedFile[0]));
					}}>
					{mediaPreview === null ? (
						<>
							<div>
								<h2>Drag n Drop or Click to upload image</h2>
							</div>
						</>
					) : (
						<>
							<div>
								<img
									src={mediaPreview}
									style={{ cursor: "pointer" }}
									onChange={() => inputRef.current.click()}
								/>
							</div>
						</>
					)}
				</div>
			</div>
		</>
	);
};

export default ImageDropDiv;
