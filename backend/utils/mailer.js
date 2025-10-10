import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendMail = async (email, subject, message) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true para 465, false para 587
            auth: {
                user: process.env.MAIL_USER, // e-mail da Tikitos
                pass: process.env.MAIL_PASS, // senha de app do Gmail
            },
            // connectionTimeout: 10_000,
            // greetingTimeout: 10_000,
            // socketTimeout: 10_000
        });

        console.log("Enviando email para: ", email);
    
        const info = await transporter.sendMail({
            from: '"Tikitos Brinquedos" <' + process.env.MAIL_USER + '>',
            to: email,
            subject,
            text: message,
            html: `
                <div style="font-family: Arial; padding: 15px; border: 1px solid #eee;">
                    <h2 style="color: #ff7a00;">Tikitos Brinquedos</h2>
                    <p>${message}</p>
                    <hr>
                    <p style="font-size: 12px; color: #666;">
                        Esta mensagem foi enviada automaticamente pelo sistema da Tikitos.
                        <br>Por favor, não responda este e-mail.
                    </p>
                </div>
            `,
        });

        console.log("E-mail enviado com sucesso: ", info.messageId);
       
        return info;
        
    } catch (error) {
        console.error("Erro ao enviar e-mail: ", error);
        throw error;
    }
};

export { sendMail };
