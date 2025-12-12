import 'dotenv/config';
import fastifyCors from "@fastify/cors";
import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifyMultipart from "@fastify/multipart";
import { FastifyReply, FastifyRequest } from "fastify";

import { validatorCompiler, serializerCompiler } from "fastify-type-provider-zod";
import { registerRoutes } from "../routes/index.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyMultipart, {
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

app.register(fastifyCors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
});

app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET as string
});


app.decorate("authenticate", authenticate);

app.register(registerRoutes);

if (process.env.NODE_ENV !== 'production') {
    app.listen({ port: 8080, host: '0.0.0.0' }).then(() => {
        console.log('Server está rodando na porta 8080');
    });
}

export default async (req: any, res: any) => {
    await app.ready();
    app.server.emit('request', req, res);
}