import fs from 'node:fs';
import { v4 as uuidv4 } from 'uuid';

// get all todos
export const getAllTodos = (req, res) => {
  fs.readFile('data/todo.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        message: err.message,
      });
    }
    try {
      let jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch (err) {
      console.error('Ошибка при разборе JSON:', err);
    }
  });
};

//get one todo
export const getOneTodo = (req, res) => {
  fs.readFile('data/todo.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        message: err.message,
      });
    }
    try {
      let jsonData = JSON.parse(data);
      const todo = jsonData.find((item) => item.id == req.params.id);
      if (!todo) {
        throw new Error('Todo list не найден');
      }
      res.json(todo);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  });
};

//create todos
export const createTodos = (req, res) => {
  fs.readFile('data/todo.json', 'utf8', (err, data) => {
    try {
      if (err) {
        throw new Error('Не удалось прочитать файл');
      }
      let jsonData = JSON.parse(data);
      let newData = [
        ...jsonData,
        {
          text: req.body.text,
          isImportant: false,
          isDone: false,
          id: uuidv4(),
          time: new Date(),
        },
      ];

      fs.writeFile('data/todo.json', JSON.stringify(newData), () => {
        res.json(newData);
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  });
};

//update one todo
export const updateOneTodo = (req, res) => {
  fs.readFile('data/todo.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        message: err.message,
      });
    }
    try {
      let jsonData = JSON.parse(data);
      let newTodo = jsonData.map((item) => {
				if (item.id == req.params.id) {
					return {...item, ...req.body};
        } else {
          return item;
        }
      });
      fs.writeFile('data/todo.json', JSON.stringify(newTodo), () => {
        res.json(newTodo);
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  });
};

//delete todo

export const deleteOneTodo = (req, res) => {
	fs.readFile('data/todo.json', 'utf8', (err, data) => {
		if (err) {
			console.log(err);
			return res.status(500).json({
				message: err.message,
			});
		}
		try {
			let jsonData = JSON.parse(data)
			let deleteTodo = jsonData.filter((item) => item.id !== req.params.id)
			
			fs.writeFile('data/todo.json', JSON.stringify(deleteTodo), () => {
				res.json(deleteTodo)
			})
		} catch (err) {
			res.status(500).json({
        message: err.message,
      });
		}
	})
}