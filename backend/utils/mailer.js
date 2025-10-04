import nodemailer from "nodemailer"
 
const sendMail = async (email, text) => {
    // Create a test account or replace with real credentials.
    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "maddison53@ethereal.email",
            pass: "jn7jnAPss4f63QBp6D",
        },
    });
 
    // Wrap in an async IIFE so we can use await.
    (async () => {
        const info = await transporter.sendMail({
            from: '"Maddison Foo Koch" <maddison53@ethereal.email>',
            to: email,
            subject: "Hello ✔",
            text: text, // plain‑text body
            html: "<b>Hello world?</b>", // HTML body
        });
 
        console.log("Message sent:", info.messageId);
    })();
}
 
export { sendMail }