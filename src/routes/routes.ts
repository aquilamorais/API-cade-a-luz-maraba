import { FastifyTypedInstance } from "../main/types.js";
import z from "zod";

export async function routes(app: FastifyTypedInstance){
    app.get('/teste', async (request, reply) => {
        return reply.status(401).send(
            {message: "Teste"}
        )
    })

    app.post('/users', {
        schema: {
            body: z.object({
                name: z.string() //teste
            })
        }
    } , async (request, reply) => {
        return {}
    })
}