import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import userRouter from './routes/userRoutes.js'
import healthRouter from './routes/healthRouter.js'
const PORT = process.env.PORT
const app = express()


// Config
 
    app.use(express.json())
    app.use(cors({origin: 'http://localhost:5173',credentials:true}))

// Routes
    app.use(healthRouter)
    app.use('/auth',userRouter)



app.listen(PORT)