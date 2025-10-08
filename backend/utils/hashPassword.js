import bcrypt from "bcryptjs";

export async function generateHashedPassword(senha) {
  try {
    // Gerar o salt
    const salt = await bcrypt.genSalt(10);
    // Hashear a senha com o salt
    return await bcrypt.hash(senha, salt);
  } catch (error) {
    console.error("Erro ao hashear a senha:", error);
    return error;
  }
}
