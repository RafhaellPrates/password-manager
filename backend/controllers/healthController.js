import pool from "../db/index.js";

const health = async (req,res)  => {

    try{
        await pool.query('SELECT 1');
        
        res.sendStatus(200)
        
    } catch (err){
        res.status(500).json({erro:'Erro interno'})
    }
}
export default {
    health
}