import mongoose from "mongoose";

const todosSchema = new mongoose.Schema({
	text: {
		type: String,
		required: true,
	},
	isImportant: {
		type: Boolean,
		required: true
	},
	isDone: {
		type: Boolean,
		required: true
	},
	age: {
		type: Number
	}

},
	{
		timestamps: true
	}
)

export default mongoose.model('todos', todosSchema)