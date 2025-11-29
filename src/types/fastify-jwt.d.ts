    import '@fastify/jwt'
    import { FastifyRequest, FastifyReply } from 'fastify';

    declare module '@fastify/jwt' {
      interface FastifyJWT {
  
        payload: { 
            id: string;
            name: string;
            email: string;
            role: enum;
         }, 

        user: {
            id: string;
            name: string;
            email: string;
            role: enum;
        } 
      }
    }
    
    declare module 'fastify' {
        export interface FastifyInstance {
            authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>;
        }
    }
    
