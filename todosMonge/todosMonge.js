import TodosModel from '../models/todos.js';


// get all todo from mongo db
export const getTodosAll = async (req, res) => {
	try {
		const todos = await TodosModel.find()
		res.json(todos)
	} catch (err) {
		res.status(500).json({
      error: err.message,
    });
	}
}

// get one todo by id from mongo db
export const getOneTodos = async (req, res) => {
	try {
		const todoId = req.params.id
		const doc = await TodosModel.findById({_id: todoId});
	
		res.json(doc)
	} catch (err) {
		res.status(500).json({
      error: err.message,
    });
	}
}

// create todo from mongo db
export const todosCreate = async (req, res) => {
	try {
		const doc = new TodosModel({
			text: req.body.text,
			age: req.body.age,
			isImportant: false,
			isDone: false
		})
		const todos = await doc.save()

		res.json(todos)
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

//edit by id one todo
export const editOneTodos = async (req, res) => {
	try {
		const todoId = req.params.id
		await TodosModel.updateOne({
			_id: todoId
		}, req.body, { returnDocument: 'after' })
		
		res.json({success: true})

	} catch (err) {
		res.status(500).json({
      error: err.message,
    });
	}
}


//delete by id one todo
export const deleteOneTodos = async (req, res) => {
	try {
		const todoId = req.params.id
		await TodosModel.deleteOne({
			_id: todoId
		}, req.body, { returnDocument: 'after' })
		
		res.json({success: true})

	} catch (err) {
		res.status(500).json({
      error: err.message,
    });
	}
}
