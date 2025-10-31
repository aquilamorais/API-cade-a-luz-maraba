    import '@fastify/jwt'
    import { FastifyRequest, FastifyReply } from 'fastify';

    declare module '@fastify/jwt' {
      interface FastifyJWT {
  
        payload: { 
            id: number;
            name: string;
            email: string;
            role: string;
         }, 

        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        } 
      }
    }
    
    declare module 'fastify' {
        export interface FastifyInstance {
            authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>;
        }
    }
    
