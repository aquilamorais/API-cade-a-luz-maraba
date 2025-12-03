import { createUser, getUser, getAllUsers, updateUser, deleteUser } from "../services/user.js";
import { authenticateUser } from "../services/login.js";
export async function handleCreateUser(request, reply) {
    const userData = request.body;
    try {
        const user = await createUser(userData, reply);
        if (!user) {
            return null;
        }
        const userWithoutPassword = {
            name: user.name,
            email: user.email,
            cpf: user.cpf,
            role: user.role
        };
        return reply.status(201).send(userWithoutPassword);
    }
    catch (error) {
        console.error("Erro em POST /users:", error);
        return reply.status(500).send({ message: "Erro interno do servidor ao criar usuário." });
    }
}
export async function handleLogin(request, reply) {
    const app = request.server;
    try {
        const user = await authenticateUser(request.body, reply);
        if (!user) {
            return null;
        }
        const token = app.jwt.sign({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }, { expiresIn: "7 days" });
        return reply.status(200).send({ token });
    }
    catch (error) {
        console.error("Erro em POST /login:", error);
        return reply.status(500).send({ message: "Erro interno do servidor ao fazer login." });
    }
}
export async function handleGetUser(request, reply) {
    const { cpf } = request.params;
    try {
        const user = await getUser(cpf);
        if (!user) {
            return reply.status(404).send({ message: 'Usuário não encontrado.' });
        }
        const userWithoutPassword = {
            id: user.id,
            name: user.name,
            email: user.email,
            cpf: user.cpf,
            role: user.role,
            complaints: user.complaints
        };
        return reply.send(userWithoutPassword);
    }
    catch (error) {
        return reply.status(500).send({ message: 'Erro interno do servidor.' });
    }
}
export async function handleGetAllUsers(request, reply) {
    try {
        const users = await getAllUsers();
        const usersWithoutPassword = users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            cpf: user.cpf,
            role: user.role
        }));
        return reply.status(200).send(usersWithoutPassword);
    }
    catch (error) {
        console.error("Erro em GET /users:", error);
        return reply.status(500).send({ message: "Erro interno do servidor ao buscar usuários." });
    }
}
export async function handleUpdateUser(request, reply) {
    const { id } = request.params;
    const updatedData = request.body;
    try {
        const user = await updateUser(id, updatedData);
        if (!user) {
            return reply.status(404).send({ message: 'Usuário não encontrado para atualizar.' });
        }
        const userWithoutPassword = {
            id: user.id,
            name: user.name,
            email: user.email,
            cpf: user.cpf,
            role: user.role
        };
        return reply.send(userWithoutPassword);
    }
    catch (error) {
        console.error('Erro ao atualizar usuário:', error); // ADICIONE ESTE LOG
        return reply.status(500).send({
            message: 'Erro interno do servidor.',
            error: error instanceof Error ? error.message : String(error)
        });
    }
}
export async function handleDeleteUser(request, reply) {
    const { cpf } = request.params;
    try {
        const user = await deleteUser(cpf);
        if (!user) {
            return reply.status(404).send({ message: 'Usuário não encontrado para deletar.' });
        }
        return reply.send({ message: 'Usuário deletado com sucesso.' });
    }
    catch (error) {
        return reply.status(500).send({ message: 'Erro interno do servidor.' });
    }
}
//# sourceMappingURL=user.controller.js.map