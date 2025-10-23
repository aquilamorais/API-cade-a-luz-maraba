import { FastifyInstance } from "fastify";
import z from "zod";

export async function routes(app: FastifyInstance){
    app.get('/teste', async (request, reply) => {
        return reply.status(401).send(
            {message: "Teste"}
        )
    })

    app.post('/users', {
        schema: {
            body: z.object
        }
    } , async (request, reply) => {
        return {}
    })
}