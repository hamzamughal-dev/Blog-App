// Email utility for sending password reset emails
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Check if we're in development mode and email is not configured
    if (process.env.NODE_ENV === 'development' && process.env.SMTP_USER === 'your-email@gmail.com') {
        // For development, log email details instead of sending actual email
        console.log('=== EMAIL SIMULATION (Configure SMTP to send real emails) ===');
        console.log('To:', options.email);
        console.log('Subject:', options.subject);
        console.log('Message:', options.message);
        console.log('===========================================================');
        return;
    }

    try {
        // Create transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        // Email options
        const mailOptions = {
            from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.html || options.message
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        
    } catch (error) {
        console.error('Email sending failed:', error.message);
        throw new Error('Email could not be sent');
    }
};

module.exports = sendEmail;