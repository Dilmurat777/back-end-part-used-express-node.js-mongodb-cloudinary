import {body} from 'express-validator'

export const createTodo = [
	body('text', 'Текст должен быть минимум 3 символа и максимум 20').isString().isLength({ min: 3, max: 20 }),
	// body('isImportant', 'Важность задачи обязательна').isBoolean(),
	// body('isDone', 'Статус done задача обязательна').isBoolean(),
	body('time', 'Время создания задачи обязательна').isDate({format: 'mm/dd/yy'})
]