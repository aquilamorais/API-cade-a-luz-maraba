import fastify from "fastify";
import { request } from "http";

const app = fastify();


app.get('/teste', async (request, reply) => {
    return reply.status(401).send(
        {message: "Teste"}
    )
})


app.listen({port: 8080}).then(()=>{
    console.log('Server está prestando na porta 8080');
})