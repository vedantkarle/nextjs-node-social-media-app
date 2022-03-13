const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const followerSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		followers: [
			{
				user: {
					type: Schema.Types.ObjectId,
					ref: "User",
				},
			},
		],
		following: [
			{
				user: {
					type: Schema.Types.ObjectId,
					ref: "User",
				},
			},
		],
	},
	{ versionKey: false },
);

module.exports = mongoose.model("Follower", followerSchema);
