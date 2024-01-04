import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	age: {
		type: Number,
		required: true
	},
	passwordHash: {
		type: String,
		required: true
	}
},
	{
		timestamps: true
	}
)

export default mongoose.model('users', usersSchema)