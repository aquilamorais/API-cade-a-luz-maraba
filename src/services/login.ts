import { prisma } from "../main/prisma.js";
import { verifyPassword } from "../utils/argon2.js";
import { Login } from "../types/login.js"; // Criaremos este tipo no próximo passo

export const authenticateUser = async (data: Login) => {
    const { email, password } = data;

    // 1. Encontre o usuário pelo e-mail
    const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
    });

    if (!user) {
        // Se o usuário não existe, retorne null
        return null;
    }

    // 2. Verifique se a senha bate
    const isPasswordCorrect = await verifyPassword(user.password, password);

    if (!isPasswordCorrect) {
        // Se a senha estiver errada, retorne null
        return null;
    }

    // 3. Se tudo deu certo, retorne o usuário
    return user;
}