const items = (req,res)=>{
    
    return res.status(200).json({user:req.user})
}

export default {
    items
}