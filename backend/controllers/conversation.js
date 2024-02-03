const Message = require('../models/message');


const convertIntoSeconds = (time) => {
    return new Date(`${time}`).getTime();
}

exports.postMessage = async (req, res, next) => {
    const { message_text, sent_to } = req.body;
    console.log(req.body);
    try {
        const result = await req.user.createMessage({message_text: message_text,sent_to: sent_to,message_sender_name: req.user.name})
        res.status(200).json({messageInfo: result.dataValues, success: true, message: 'Message sent succesfully!!'})
    
    } catch (err) {
        console.log(err, 'err')
    }
}

exports.getMessage = async (req, res, next) => {
    console.log('get request rcv');
    const contactIdOfReceiver = req.params.contactIdOfReceiver;
    const messagequeue = [];
    const recieversMessages = [];
    try {
        const messages = await req.user.getMessages({ where: { sent_to: contactIdOfReceiver } })
        messages.forEach(element => {messagequeue.push(element.dataValues);});
        const recieversMessageArr = await Message.findAll({ where: { userId: contactIdOfReceiver, sent_to: req.user.id } })
        recieversMessageArr.forEach(element=>{ recieversMessages.push(element.dataValues)})
        const completeConversation = [...messagequeue, ...recieversMessages];
        for (let i = 0; i < completeConversation.length; i++){
            for (let j = i; j < completeConversation.length; j++){
                let time_j = convertIntoSeconds(completeConversation[j].createdAt);
                let time_i = convertIntoSeconds(completeConversation[i].createdAt);
                if (time_j < time_i) {
                    let temp = completeConversation[j];
                    completeConversation[j] = completeConversation[i];
                    completeConversation[i] = temp;
                }
            }
        }
        res.status(200).json({ messages: completeConversation, success: true, message: 'messages fetched successfully' })
    
    
    } catch (err) {
        console.log(err)
    };
}