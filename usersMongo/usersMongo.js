import UsersModel from '../models/users.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'


//auth register
export const register = async (req, res) => {
	try {
		const { password, ...other } = req.body
		const salt = await bcrypt.genSalt(10)
		const hash = await bcrypt.hash(password, salt)

		const doc = new UsersModel({
			...other,
			passwordHash: hash
		})

		const user = await doc.save()


		const token = jwt.sign({
			_id: user._id
		}, 'secret123', { expiresIn: '90d' }) //expires after 90 days
		

		const {passwordHash, ...userData} = user._doc
		res.json({
			userData,
			token
		})

	} catch (err) {
		res.status(500).json({
      message: 'Не удалось зарегистрироваться',
    });
	}
}

//auth login
export const login = async (req, res) => { 
	try {

		const user = await UsersModel.findOne({ email: req.body.email })
		
		if (!user) {
			return res.status(404).json({
				message: 'Такого аккаунта не существует'
			})
		}

		const inValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)

		if (!inValidPass) {
			return res.status(404).json({
				message: 'Неверный логин или пароль'
			})
		}

		const token = jwt.sign({
			id: user._id
		}, 'secret123', {expiresIn: '90d'}) //expires after 90 days
		
		const { passwordHash, ...userData } = user._doc
		
		res.json({
			...userData,
			token
		})

	} catch (err) {
		res.status(500).json({
      message: 'Не удалось войти',
    });
	}
}