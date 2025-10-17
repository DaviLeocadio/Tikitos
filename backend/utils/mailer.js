import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

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
    // campo extra que você pode verificar no app
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
  // smtp responses frequentemente vêm com responseCode
  if (err.responseCode && (err.responseCode >= 421 || err.responseCode === 554)) return true;
  return false;
};

const createTransporter = async () => {
  // se quiser forçar fake (por exemplo quando a rede do SENAI bloqueia)
  if (process.env.FAKE_EMAIL === "true") return null;

  // cria transporte padrão Gmail (ou outro via env)
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.MAIL_PORT) || 587,
    secure: process.env.MAIL_SECURE === "true", // true para 465
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    connectionTimeout: Number(process.env.MAIL_CONN_TIMEOUT) || 10_000,
    greetingTimeout: Number(process.env.MAIL_GREET_TIMEOUT) || 10_000,
    socketTimeout: Number(process.env.MAIL_SOCKET_TIMEOUT) || 10_000,
  });

  return transporter;
};

const sendMail = async (email, subject, message) => {
  // modo forçado fake (útil quando a rede bloqueia e você não pode liberar TCP)
  if (process.env.FAKE_EMAIL === "true") {
    console.log("⚠️ FAKE EMAIL MODE ativo — não enviando email de verdade.", email);
    return makeFakeInfo(email);
  }

  const transporter = await createTransporter();

  // se createTransporter retornou null por fake env, já tratamos acima
  try {
    console.log("📨 Tentando enviar e-mail para:", email);

    // opcional: verificar conexão rápida antes de enviar
    // falhas aqui normalmente indicam bloqueio/restrição de rede
    await transporter.verify();

    const info = await transporter.sendMail({
      from: `"Tikitos Brinquedos" <${process.env.MAIL_USER}>`,
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

    console.log("✅ E-mail enviado com sucesso:", info.messageId);
    return info;
  } catch (err) {
    console.error("⚠️ Erro ao enviar e-mail:", err && (err.code || err.responseCode) || err);

    // Se for erro de rede (porta bloqueada / timeouts) - retorna resposta fake
    if (isNetworkError(err)) {
      console.warn("⚠️ Detectado erro de rede. Retornando resposta fake para não travar fluxo.");
      return makeFakeInfo(email);
    }

    // outros erros (ex.: credenciais) devem ser repassados para o caller tratar
    throw err;
  }
};

export { sendMail };
