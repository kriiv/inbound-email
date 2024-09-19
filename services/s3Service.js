const config = require('../config');

async function uploadToS3(attachment) {
  if (attachment.size > config.MAX_FILE_SIZE) {
    console.log(`Skipping large attachment: ${attachment.filename} (${attachment.size} bytes)`);
    return null;
  }

  const params = {
    Bucket: config.BUCKET_NAME,
    Key: `${Date.now()}-${attachment.filename}`,
    Body: attachment.content,
    ContentType: attachment.contentType
  };

  try {
    const result = await config.s3.upload(params).promise();
    return result.Location;
  } catch (error) {
    console.error('S3 upload error:', error);
    throw error;
  }
}

module.exports = { uploadToS3 };