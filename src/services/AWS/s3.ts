import S3 from 'aws-sdk/clients/s3'
import fs from 'fs'
import config from '../../config/index'
import { getExtensionFromMime } from '../../utils'

const bucketName = config.BUCKET_NAME
const region = config.REGION
const accessKeyId = config.ACCESS_KEY_ID
const secretAccessKey = config.SECRET_ACCESS_KEY

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
})

// uploads a file to s3

export function uploadFile(file: any) {
  const fileStream = fs.createReadStream(file.path)
  const fileName = `${file.filename}${getExtensionFromMime(file.mimetype)}`

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: fileName,
  }

  return s3.upload(uploadParams).promise()
}

// downloads a file from s3
export function getFileStream(fileKey: string) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
  }
  return s3.getObject(downloadParams).createReadStream()
}
