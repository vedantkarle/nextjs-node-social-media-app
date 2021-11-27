const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const profileSchema = Schema({
	user: { type: Schema.Types.ObjectId, ref: "User" },
	bio: {
		type: String,
		required: true,
	},
	social: {
		facebook: {
			type: String,
		},
		twitter: {
			type: String,
		},
		youtube: {
			type: String,
		},
		instagram: {
			type: String,
		},
	},
});

module.exports = mongoose.model("Profile", profileSchema);
