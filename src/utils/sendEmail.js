import nodemailer from "nodemailer";

export const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

export const sendVerificationEmail = async (toEmail, otp) => {

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: `"CVision" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: "Verify Your Email - OTP",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto;">
                <h2>Email Verification</h2>
                <p>Your 4-digit OTP is valid for <strong>10 minutes</strong>.</p>
                <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; 
                            padding: 16px; background: #f0f0f0; text-align: center; 
                            border-radius: 8px;">
                    ${otp}
                </div>
                <p style="color: #999; font-size: 12px; margin-top: 16px;">
                    If you didn't request this, ignore this email.
                </p>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};