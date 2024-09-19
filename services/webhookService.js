const axios = require('axios');
const config = require('../config');

function sendToWebhook(data) {
  return axios.post(config.WEBHOOK_URL, data, { timeout: 5000 });
}

module.exports = { sendToWebhook };