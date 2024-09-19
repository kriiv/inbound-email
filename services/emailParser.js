const simpleParser = require('mailparser').simpleParser;
const { uploadToS3 } = require('./s3Service');

async function parseEmail(stream) {
  const parsed = await simpleParser(stream);
  const attachments = parsed.attachments || [];
  delete parsed.attachments;

  const processedAttachments = await Promise.all(attachments.map(async att => {
    const s3Url = await uploadToS3(att);
    return {
      filename: att.filename,
      contentType: att.contentType,
      size: att.size,
      s3Url: s3Url,
      skipped: s3Url === null
    };
  }));

  parsed.attachmentInfo = processedAttachments.filter(att => !att.skipped);
  parsed.skippedAttachments = processedAttachments.filter(att => att.skipped).map(att => ({
    filename: att.filename,
    size: att.size
  }));

  return parsed;
}

module.exports = { parseEmail };