import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* -------------------------------------------------------
   FUNÇÃO PARA GERAR HTML DO EMAIL COM O TOKEN
------------------------------------------------------- */
const generateDigitsHTML = (token) => {
  return String(token)
    .split("")
    .map((d, i, arr) => `
      <div style="
        width:42px;height:52px;
        border:3px dashed #76196c;
        border-radius:16px;
        background-color:#B8F490;
        color:#4F6940;
        font-size:24px;
        font-weight:800;
        line-height:52px;
        text-align:center;
        display:inline-block;
        margin-right:${i === arr.length - 1 ? 0 : 8}px;
      ">${d}</div>
    `)
    .join("");
};

const generateEmailHTML = (token) => {
  const digitsHTML = generateDigitsHTML(token);

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<body style="margin:0;padding:0;background:#e8c5f1;font-family:'Poppins',Arial,sans-serif;">

  <div style="max-width:600px;margin:0 auto;padding:40px 20px;text-align:center;">

    <img 
      src="cid:logoTikitos"
      alt="Tikitos"
      style="width:200px;max-width:100%;display:block;margin:0 auto 20px auto;"
    />

    <h2 style="margin:0;color:#924187;font-size:26px;font-weight:800;letter-spacing:-0.5px;">
      Código de verificação:
    </h2>

    <p style="margin:15px 0 30px 0;color:#666;font-size:16px;line-height:1.6;">
      Use o código abaixo para confirmar seu acesso à Tikitos e continuar espalhando alegria com a gente :)
    </p>

    <div style="
      margin:0 auto;
      padding:18px 14px;
      max-width:340px;
      background:#e8c5f1;
      border-radius:22px;
      box-shadow:0 2px 8px rgba(0,0,0,0.15);
      ">
      
      <p style="margin:0 0 12px 0;color:#4f6940;font-size:15px;font-weight:700;">
        Seu código de verificação é:
      </p>

      <div style="display:flex; justify-content:center; flex-wrap:wrap;">
        ${digitsHTML}
      </div>

      <!-- versão em texto do código (para clientes que removem estilos) -->
      <p style="display:none; margin:12px 0 0 0;color:#4f6940;font-size:18px;font-weight:800;letter-spacing:4px;">
        ${String(token).split("").join(" ")}
      </p>

      
      <h3 style="margin:50px 0 5px 0;color:#924187;font-size:20px;font-weight:800;">
      Lembrete importante!
      </h3>
      
      <p style="margin:0 0 30px 0;color:#666;font-size:15px;line-height:1.4;">
      O código é válido por <strong>tempo limitado</strong>,<br/> então use rapidinho!
      </p>
      
    <p style="margin:0 0 12px 0;color:#4f6940;font-size:15px;font-weight:700;">
      Para dúvidas ou ajuda, entre em contato:
    </p>
    
    <a 
    href="mailto:contato@tikitos.com.br"
    style="
    display:inline-block;
    padding:10px 22px;
    background:#DABCE1;
    color:#4F6940;
    font-size:14px;
    font-weight:600;
    border:1px solid #d695e7;
    border-radius:14px;
    text-decoration:none;
    "
    >
    ✉️ contato@tikitos.com.br
    </a>
    
    <p style="margin-top:40px;color:#924187;font-size:16px;font-weight:800;line-height:1.4;">
    Com carinho,<br/>
    Equipe Tikitos!
    </p>
    
    </div>
  </div>

</body>
</html>
`;
};

/* -------------------------------------------------------
   SISTEMA DE FAKE EMAIL (MANTIDO 100%)
------------------------------------------------------- */
const makeFakeInfo = (email) => {
  const fakeId = `fake-${Date.now()}`;
  return {
    messageId: fakeId,
    envelope: {
      from: process.env.MAIL_USER || "no-reply@tikitos.test",
      to: [email],
    },
    accepted: [email],
    rejected: [],
    response: `250 2.0.0 OK (simulated) ${fakeId}`,
    __fake: true,
  };
};

const isNetworkError = (err) => {
  if (!err) return false;

  const networkCodes = [
    "ECONNREFUSED",
    "ETIMEDOUT",
    "EHOSTUNREACH",
    "ENETUNREACH",
    "ECONNRESET",
    "EPIPE",
  ];

  if (err.code && networkCodes.includes(err.code)) return true;
  if (err.responseCode && (err.responseCode >= 421 || err.responseCode === 554))
    return true;

  return false;
};

/* -------------------------------------------------------
   CRIA O TRANSPORTER SMTP
------------------------------------------------------- */
const createTransporter = async () => {
  if (process.env.FAKE_EMAIL === "true") return null;

  return nodemailer.createTransport({
    host: process.env.MAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.MAIL_PORT) || 587,
    secure: process.env.MAIL_SECURE === "true",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    connectionTimeout: Number(process.env.MAIL_CONN_TIMEOUT) || 10_000,
    greetingTimeout: Number(process.env.MAIL_GREET_TIMEOUT) || 10_000,
    socketTimeout: Number(process.env.MAIL_SOCKET_TIMEOUT) || 10_000,
  });
};

/* -------------------------------------------------------
   FUNÇÃO PRINCIPAL PARA ENVIAR EMAIL
------------------------------------------------------- */
const sendMail = async (email, subject, token) => {
  if (process.env.FAKE_EMAIL === "true") {
    console.log("⚠️ FAKE EMAIL MODE ativo — não enviando email real.", email);
    return makeFakeInfo(email);
  }

  const transporter = await createTransporter();

  try {
    console.log("📨 Tentando enviar e-mail para:", email);

    await transporter.verify();

    const htmlContent = generateEmailHTML(token);

    const info = await transporter.sendMail({
      from: `"Tikitos Brinquedos" <${process.env.MAIL_USER}>`,
      to: email,
      subject,
      html: htmlContent,
      attachments: [
        {
          filename: "logo.png",
          path: path.join(__dirname, "../public/img/logo.png"),
          cid: "logoTikitos",
        },
      ],
    });

    console.log("✅ E-mail enviado com sucesso:", info.messageId);
    return info;
  } catch (err) {
    console.error(
      "⚠️ Erro ao enviar e-mail:",
      err.code || err.responseCode || err
    );

    if (isNetworkError(err)) {
      console.warn("⚠️ Erro de rede detectado — retornando email fake.");
      return makeFakeInfo(email);
    }

    throw err;
  }
};

export { sendMail };
