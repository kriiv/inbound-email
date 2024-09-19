const dotenv = require('dotenv');
const AWS = require('aws-sdk');

dotenv.config();

module.exports = {
  WEBHOOK_URL: process.env.WEBHOOK_URL || 'https://enkhprqr4n2t.x.pipedream.net/',
  PORT: process.env.PORT || 25,
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || 5 * 1024 * 1024,
  BUCKET_NAME: process.env.S3_BUCKET_NAME,
  SMTP_SECURE: process.env.SMTP_SECURE === 'true',
  WEBHOOK_CONCURRENCY: process.env.WEBHOOK_CONCURRENCY || 5,

  s3: new AWS.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  })
};