


// const convertIntoSeconds = (time) => {
//     return new Date(`${time}`).getTime();
// }

// exports.postGroupMessage = async (req, res, next) => {
//     const { message_text, sent_to_groupNo } = req.body;
//     //console.log(message_text, req.user);
//     try {
//         const result = await req.user.createGroupMessage({message_text: message_text,sent_to_groupNo: sent_to_groupNo,message_sender_name:req.user.name})
//         res.status(200).json({messageInfo: result.dataValues, success: true, message: 'Message sent succesfully!!'})
    
//     } catch (err) {
//         console.log(err, 'err')
//     }
// }

// exports.getGroupMessage = async(req, res, next) => {
//     const groupId = req.params.groupId;
//     //const messagequeue = [];
//     try {
//         const messages = await GroupMessage.findAll({ where: { sent_to_groupNo: groupId } })
//         //console.log(messages);
//         res.status(200).json({ messages: messages, reqUserId:req.user.id, success: true, message: 'messages fetched successfully' })
//     } catch (err) {
//         console.log(err)
//     };
// }