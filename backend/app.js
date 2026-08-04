import 'dotenv/config'
import express from 'express'
import pool from './db/index.js'
import cors from 'cors'
const PORT = process.env.PORT
const app = express()


// Config
 
    app.use(express.json())
    app.use(cors({origin: 'http://localhost:5173',credentials:true}))


app.get('/health',async (req,res)  => {

    try{
        const [ results , fields ] = await pool.query('SELECT 1');
        
        res.sendStatus(200)
        
    } catch (err){
        console.log(err)
        res.sendStatus(500)
    }
})


app.listen(PORT)