# Inbound Email (SMTP) to Webhook

Author: [Martin Alexander](https://www.linkedin.com/in/martin-alexander)

A simple, efficient script that provides an SMTP server to receive emails, parse content (including headers), store attachments in Amazon S3, and forward email content to a webhook. Now with improved handling for multiple concurrent SMTP sessions and webhook requests.

## Features

- SMTP server to receive emails concurrently
- Parses incoming emails using `mailparser`
- Uploads attachments to Amazon S3
- Forwards parsed email content to a specified webhook
- Configurable via environment variables
- Handles large attachments gracefully
- Robust queue system for processing multiple emails and webhook requests simultaneously

## Prerequisites

- Node.js (v18 or later recommended)
- If saving attachments, an Amazon Web Services (AWS) account with S3 access or a compatible system
- A HTTP(s) webhook endpoint to receive the processed emails

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/sendbetter/inbound-email.git
   cd inbound-email
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Copy the `.env.example` file to `.env` and set the required configuration: (eg. `mv .env.example .env`)
   - `MAX_FILE_SIZE`: Maximum size of attachments to process, in bytes (default: 5MB)
   - `AWS_REGION`: Your AWS region
   - `AWS_ACCESS_KEY_ID`: Your AWS access key ID
   - `AWS_SECRET_ACCESS_KEY`: Your AWS secret access key
   - `S3_BUCKET_NAME`: The name of your S3 bucket for storing attachments
   - `PORT`: The port for the SMTP server to listen on (default: 25)
   - `WEBHOOK_URL`: The URL where parsed emails will be sent (required)
   - `SMTP_SECURE`: Set to 'true' for TLS support (default: false)
   - `WEBHOOK_CONCURRENCY`: Number of concurrent webhook requests (default: 5)

## Usage

Start the server:
```
npm start
```

The SMTP server will start and listen on the specified port (default: 25) on all network interfaces.

You can use pm2 or supervisor to keep the server running after restart. Example: `pm2 start server.js`

## Sample Use Cases

1. **Email to Ticket System**: Use this bridge to receive support emails and automatically create tickets in your helpdesk system via the webhook.

2. **Document Processing**: Receive emails with document attachments, store them in S3, and trigger a document processing pipeline through the webhook.

3. **Email Marketing Analysis**: Collect incoming emails from a campaign, store any images or attachments, and send the content to an analytics system for processing.

4. **Automated Reporting**: Set up an email address that receives automated reports, stores them in S3, and notifies your team via the webhook.

5. **DMARC Reporting**: Receive DMARC reports via email and store them in S3.

Using inbound parse for something interesting? Please let me know, I'd love to hear about it.

## Todo

- Rate limiting
- Log Storage

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License. This means you are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software, including for commercial purposes.

## Disclaimer

Please ensure you have the necessary permissions and security measures in place when deploying an SMTP server. Depending on your firewall configuration, you may be exposing this service to the internet.