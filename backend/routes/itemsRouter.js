import express from 'express'
import itemsController from "../controllers/itemsController.js";
import authenticator from '../middleware/authenticator.js'

const router = express.Router()

router.get('/',authenticator,itemsController.items)

export default router