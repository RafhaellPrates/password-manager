import bcrypt from 'bcrypt'
import pool from '../db/index.js'
import { validationResult } from 'express-validator';




const register_Post = async (req,res)=>{

    try{ 
        const erros = validationResult(req)

        if(!erros.isEmpty()){
           return res.status(400).json({erro:erros.array().map(err=>({
            path:err.path,
            msg:err.msg
           }))})

        }
        const password_hash = await bcrypt.hash(req.body.senha,10)
        const email = req.body.email
        
        const sql = 'INSERT INTO users (email, password_hash) VALUES (?,?)'

        await pool.query(sql,[email , password_hash])

        return res.sendStatus(201)
        
    }catch (err){

        if(err.code === 'ER_DUP_ENTRY'){
            return res.status(409).json({erro:'E-mail já cadastrado'})
        }
        console.error(err)
        res.status(500).json({erro:'Erro interno ao criar usuario'})

    }

}


export default {
    register_Post,
}