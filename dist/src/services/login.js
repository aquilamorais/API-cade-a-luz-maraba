import { prisma } from "../main/prisma.js";
import { verifyPassword } from "../utils/argon2.js";
export const authenticateUser = async (data, reply) => {
    const { email, password } = data;
    const emailUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
    });
    if (!emailUser) {
        reply.status(401).send({ message: "E-mail ou senha inválidos." });
        return null;
    }
    const isPasswordCorrect = await verifyPassword(emailUser.password, password);
    if (!isPasswordCorrect) {
        return null;
    }
    return emailUser;
};
//# sourceMappingURL=login.js.map