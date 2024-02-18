import fastify from 'fastify';
import { ZodError } from 'zod';
import { env } from './env';
import { toDoRoutes } from './http/todo';

export const app = fastify();

app.register(toDoRoutes);


app.setErrorHandler((error, _request, reply)=> {
    if(error instanceof ZodError){
        return reply.status(400).send({message: 'Validation error', issues: error.format()});
    }

    if(env.NODE_ENV !== 'production'){
        console.error(error);
    } else {
        // TODO: aqui devemos fazer um log para uma ferramenta externa DataDog/NodeRelic/Sentry
    }

    return reply.status(500).send({message: 'Internal server error'});
});