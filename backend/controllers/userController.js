import bcrypt from 'bcrypt'
import pool from '../db/index.js'
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken'




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

const login_post = async (req,res)=>{

    try{
        const erros = validationResult(req)

        if(!erros.isEmpty()){
           return res.status(400).json({erro:erros.array().map(err=>({
            path:err.path,
            msg:err.msg
           }))})

        }
        const { email, senha } = req.body

        const sql = 'SELECT id, email, password_hash FROM users where email = ?'
        const data = [email]
        const [linhas] = await pool.query(sql,data)
        
        if(linhas.length > 0 ){

            const user = linhas[0]

            const match =  await bcrypt.compare(senha,user.password_hash)

            if(match){

                const token = jwt.sign(
                    { id: user.id, email: user.email},
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                )

                return res.status(200).json({token:token})
            }
        }
        return res.status(401).json({erro:'Credenciais invalidas'})
         
    } catch(err){
        console.error(err)
        res.status(500).json({erro:'Erro interno no servidor'})
    }
}


export default {
    register_Post,
    login_post,
   
}