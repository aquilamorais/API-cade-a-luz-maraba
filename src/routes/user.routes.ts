import { FastifyTypedInstance } from "../main/types.js";
import { userSchema, updateUserSchema } from "../schema/user-schema.js";
import {
    handleCreateUser,
    handleUpdateUser,
    handleGetAllUsers,
    handleGetUser,
    handleDeleteUser
} from "../controllers/user.controller.js";

export async function userRoutes(app: FastifyTypedInstance) {
    app.post('/users', {
        schema: { body: userSchema }
    }, handleCreateUser);

    app.get('/users/:cpf', {
        preHandler: [app.authenticate],
    }, handleGetUser);

    app.get('/users', {
        preHandler: [app.authenticate]
    }, handleGetAllUsers);

    app.patch('/users/:id', {
        preHandler: [app.authenticate],
        schema: { body: updateUserSchema }
    }, handleUpdateUser);

    app.delete('/users/:cpf', {
        preHandler: [app.authenticate]
    }, handleDeleteUser);
}
