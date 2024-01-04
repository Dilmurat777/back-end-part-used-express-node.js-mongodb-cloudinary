import express from 'express';
import {createOneUser, deleteOneUser, getAllUsers, getOneUser, updateOneUser,} from './controllers/users/users.js';
import { createTodo } from './validations/validations.js';
import {createTodos, deleteOneTodo, getAllTodos, getOneTodo, updateOneTodo,} from './controllers/todoList/todoList.js';
import handleValidatorErrors from './validations/handleValidatorErrors.js';
import mongoose from 'mongoose';
import { deleteOneTodos, editOneTodos, getOneTodos, getTodosAll, todosCreate } from './todosMonge/todosMonge.js';
import { login, register } from './usersMongo/usersMongo.js';
import multer from 'multer';
import fs from 'node:fs'
import cloudinary from 'cloudinary';


const api = express();
api.use(express.json());
const PORT = 8080;

const mongoDbPassword = 'test123'


mongoose.connect(`mongodb+srv://hellodilmurat:${mongoDbPassword}@back-end-cluster.1qwlwim.mongodb.net/?retryWrites=true&w=majority`)
  .then(() => console.log('Mongo DB успешно запущен'))
  .catch((err) => console.log('Ошибка при запуске Mongo DB', err))

//users
api.get('/users', getAllUsers);
api.get('/users/:id', getOneUser);
api.post('/users', createOneUser);
api.patch('/users/:id', updateOneUser);
api.delete('/users/:id', deleteOneUser);

//t-odo
api.post('/todo', createTodo, handleValidatorErrors, createTodos);
api.get('/todo', getAllTodos);
api.get('/todo/:id', getOneTodo);
api.patch('/todo/:id', updateOneTodo);
api.delete('/todo/:id', deleteOneTodo);

//mongo db
api.post('/todos', todosCreate)
api.get('/todos', getTodosAll)
api.get('/todos/:id', getOneTodos)
api.patch('/todos/:id', editOneTodos)
api.delete('/todos/:id', deleteOneTodos)

//auth register/login
api.post('/auth/register', register)
api.post('/auth/login', login)



//send image to cloudinary

const upload = multer({ destination: 'uploads/' })

          
cloudinary.config({ 
  cloud_name: 'dxopqov16', 
  api_key: '869196186384284', 
  api_secret: 'v3MqdM7lWPRh9TFks4WzhYaPJuQ' 
});

api.post('/upload', upload.single('file'), (req, res) => { 

  const file = req.file;

  if (!file) {
    return res.status(400).send('Файл не найден');
  }

  const fileName = `${Date.now()}_${file.originalname}`
  const tempFilePath = `uploads/${fileName}`
  fs.writeFileSync(tempFilePath, file.buffer);

  cloudinary.v2.uploader.upload(tempFilePath, (err, result) => {
    if (err) {
      console.error('Ошибка загрузки файла:', err);
      return res.status(500).send('Ошибка загрузка файла');
    }
    fs.unlinkSync(tempFilePath);

    const publicUrl = result.secure_url;

    res.json({
      url: publicUrl
    })
  })
})

api.use('/uploads', express.static('uploads'));






//send image
// const storage = multer.diskStorage({
//   destination: (_, __, cd) => {
//     cd(null, 'uploads')
//   },
//   filename: (_, file, cd) => {
//     cd(null, file.originalname)
//   }
// })

// const upload = multer({ storage });

// api.post('/upload', upload.single('image'), (req, res) => {
//   res.json({
//     url: `/uploads/${req.file.originalname}`
//   })
// });

// api.use('/uploads', express.static('uploads'))


//auth users


api.listen(PORT, () => {
  console.log(`Север запущен на порту http://Localhost:${PORT}`);
});