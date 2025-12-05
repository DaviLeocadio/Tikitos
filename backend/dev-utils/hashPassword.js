import bcrypt from "bcryptjs";

async function generateHashedPassword() {
    const password = 'tikitos123' // senha que deseja hashear
    try {
        //gerar o salt
        const salt = await bcrypt.genSalt(10);

        //Hashear a senha com salt
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log('Senha Hasheada:', hashedPassword);
        process.exit(0); // encerra o processo após exibir o hash
    } catch (error) {
        console.error('Erro ao hashear a senha:', error);
        process.exit(1) // encerra o processo após exibir o hash
    }
}
generateHashedPassword();