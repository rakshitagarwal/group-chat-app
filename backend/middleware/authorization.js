const { json } = require('express/lib/response');
const jwt=require('jsonwebtoken')
const User=require('../models/user')

const authorization = (req, res, next) => {
    console.log('auth')
    const authHeader=req.header('authorization');
    const token=authHeader.split(' ')[1];
    if(!token)
    return res.status(401).json({success:false,message:"Token not found in header"})
    try {
        const response=jwt.verify(token,`${process.env.TOKEN_SECRET}`)
        User.findOne({where:{id:response.id}})
            .then(user => {
            req.user=user // <-------attaching authorised users in request object, which is global object 
            next()
        })
        .catch(err=>{
            console.log(err)
        })

    } catch (err) {
        console.log(err)
        res.json({message:'Login again and try'});
    }

}

module.exports=authorization;