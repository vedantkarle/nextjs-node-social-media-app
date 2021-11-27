const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			unique: true,
			required: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			select: false,
			trim: true,
		},
		username: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		profilePicUrl: {
			type: String,
		},
		newMessagePopup: {
			type: Boolean,
			default: true,
		},
		unreadMessage: {
			type: Boolean,
			default: false,
		},
		unreadNotification: {
			type: Boolean,
			default: false,
		},
		role: {
			type: String,
			default: "user",
			enum: ["user", "root"],
		},
		resetToken: {
			type: String,
		},
		expireToken: { type: Date },
	},
	{ timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
