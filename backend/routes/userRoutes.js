import express from "express";
import userController from '../controllers/userController.js'
import { body } from "express-validator";

const router = express.Router()


router.post('/register', [
    body('email').isEmail().withMessage('Precisa ser um e-mail válido'),
    body('senha').isLength({min:8,max:72}).withMessage('Precisa no mínimo 8 caracteres é no máximo 72 caracteres')
],userController.register_Post)
router.post('/login',[
    body('email').isEmail().withMessage('Precisa ser um e-mail válido'),
    body('senha').notEmpty()
],userController.login_post)


export default router