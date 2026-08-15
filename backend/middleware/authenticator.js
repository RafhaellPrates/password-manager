import jwt from "jsonwebtoken";

export default (req,res,next)=>{

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({erro:'token ausente'})
    }

    try{
        
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.user = {id : decoded.id}
        
        next()

    }catch (err) {
        console.log(err.name)
        return res.status(401).json({erro:'token expirado/adulterado'})
    }
}