const { Sequelize } = require('sequelize');
const Message = require('../models/message');
const Op = Sequelize.Op;
const S3Services = require("../services/s3Services");


exports.postMedia = async (req, res, next) => {
    try {
        
        console.log('formdata files data', req.files.file.data);
        
        const uploadedfiles = req.files;
        
        for (let key of formData.keys()) {
            console.log('inside formData', formData.get(key));
        }
        res.status(200).json({ success: true, message:'recieved' });
    //const mediaPath = await req.file;
    const groupId = req.params.groupId;
    const userId = req.user.id;
    const fileName = `${userId}/${new Date()}`;
    const mediaLink = await S3Services.uploadToS3(fileName, uploadedfiles);
    // await req.user.createDownload({
    //   fileName: `${new Date()}`,
    //   link: `${mediaLink}`,
    // });
    // res.status(200).json({ success: true, fileUrl: downloadLink });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.postGroupMessage = async (req, res, next) => {
    const { message_text, sent_to_groupNo } = req.body;
    //console.log(message_text, req.user);
    try {
        const result = await req.user.createMessage({message_text: message_text,sent_to_groupId: sent_to_groupNo,message_sender_name:req.user.name})
        res.status(200).json({messageInfo: result.dataValues, success: true, message: 'Message sent succesfully!!'})
    
    } catch (err) {
        console.log(err, 'err')
    }
}

exports.getGroupMessage = async (req, res, next) => {
    const lastMsgId = req.query.lastMsgId;
    console.log(lastMsgId);
    const groupId = req.params.groupId;
    try {
        console.log('messages to send: ', groupId);
        const messages = await Message.findAll({
            where: {
                sent_to_groupId: groupId,
                id: {
                    [Op.gt]:lastMsgId,
                }

            }
        })
        console.log('messages to send: ', messages);
        res.status(200).json({ messages: messages, reqUserId:req.user.id, success: true, message: 'messages fetched successfully' })
    } catch (err) {
        console.log(err)
    };
}