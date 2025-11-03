import fastifyCors from "@fastify/cors";
import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import { FastifyReply, FastifyRequest } from "fastify";

import { validatorCompiler, serializerCompiler } from "fastify-type-provider-zod";
import { routes } from "../routes/routes.js";

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {origin: '*'});

app.register(fastifyJwt, {
   secret: process.env.JWT_SECRET as string
});

app.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        await request.jwtVerify();
    } catch (err) {
        reply.send(err);
    }
});

app.register(routes);


app.listen({port: 8080, host: '0.0.0.0'}).then(()=>{
    console.log('Server está prestando na porta 8080');
})