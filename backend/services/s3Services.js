const AWS=require('aws-sdk')

const uploadToS3=async (fileName,data)=>{
    const bucketName=`${process.env.bucketName}` //
    try {
        const s3Bucket= await new AWS.S3({
            accessKeyId:`${process.env.accessKeyId}`, 
            secretAccessKey: `${process.env.secretAccessKey}` 
            
        })
        const params={
            Bucket:bucketName,
            Key:fileName,
            Body:data,
            ACL:'public-read'
        }

        return new Promise((resolve,reject)=>{
            s3Bucket.upload(params,(err,s3response)=>{
                if(err)
                    reject(err)
                else{
                    console.log(s3response)
                    resolve(s3response.Location)
                }
            })
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports={
    uploadToS3
}