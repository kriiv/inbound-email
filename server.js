const SMTPServer = require('smtp-server').SMTPServer;
const config = require('./config');
const { parseEmail } = require('./services/emailParser');
const { sendToWebhook } = require('./services/webhookService');
require('aws-sdk/lib/maintenance_mode_message').suppress = true;

// Create a queue to store parsed emails
const emailQueue = [];
let isProcessingQueue = false;

// Function to process the queue
function processQueue() {
  if (isProcessingQueue || emailQueue.length === 0) return;

  isProcessingQueue = true;
  const parsed = emailQueue.shift();

  sendToWebhook(parsed)
    .then(() => {
      console.log('Successfully sent to webhook');
      isProcessingQueue = false;
      processQueue(); // Process next item in queue
    })
    .catch(error => {
      console.error('Webhook error:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      isProcessingQueue = false;
      processQueue(); // Process next item in queue even if there's an error
    });
}

const server = new SMTPServer({
  onData(stream, session, callback) {
    parseEmail(stream)
      .then(parsed => {
        // Add parsed email to queue instead of sending immediately
        emailQueue.push(parsed);
        console.log('Email added to queue. Queue length:', emailQueue.length);
        callback();
        processQueue(); // Try to process queue
      })
      .catch(error => {
        console.error('Parsing error:', error);
        callback(new Error('Failed to parse email'));
      });
  },
  onError(error) {
    console.error('SMTP server error:', error);
  },
  disabledCommands: ['AUTH'],
  secure: config.SMTP_SECURE
});

server.listen(config.PORT, '0.0.0.0', err => {
  if (err) {
    console.error('Failed to start SMTP server:', err);
    process.exit(1);
  }
  console.log(`SMTP server listening on port ${config.PORT} on all interfaces`);
});

function gracefulShutdown(reason) {
  console.log(`Shutting down: ${reason}`);
  server.close(() => {
    console.log('Server closed. Exiting process.');
    process.exit(0);
  });
}

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  gracefulShutdown('Uncaught exception');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('Unhandled rejection');
});

process.on('SIGTERM', () => {
  gracefulShutdown('SIGTERM signal received');
});

process.on('SIGINT', () => {
  gracefulShutdown('SIGINT signal received');
});