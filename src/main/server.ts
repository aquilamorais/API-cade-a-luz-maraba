import fastifyCors from "@fastify/cors";
import fastify from "fastify";
import { request } from "http";
import { validatorCompiler, serializerCompiler } from "fastify-type-provider-zod";
import { routes } from "../routes/routes.js";


const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {origin: '*'});

app.register(routes);


app.listen({port: 8080}).then(()=>{
    console.log('Server está prestando na porta 8080');
})