import { FastifyTypedInstance } from "../main/types.js";
import { loginSchema } from "../schema/login-schema.js";
import { handleLogin, handleGetMe } from "../controllers/auth.controller.js";

export async function authRoutes(app: FastifyTypedInstance) {
    app.post('/login', {
        schema: { body: loginSchema }
    }, handleLogin);

    app.get('/me', {
        preHandler: [app.authenticate]
    }, handleGetMe);
}
