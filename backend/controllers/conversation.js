const Message = require('../models/message');
const User = require('../models/user');

exports.postMessage = (req, res, next) => {
    console.log(req.body);
//     req.user.createMessage({

//     }) 
}

exports.getMessage = (req, res, next) => {
    req.user.createMessage({
        
    })
}