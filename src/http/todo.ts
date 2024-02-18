import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

export async function toDoRoutes(app: FastifyInstance){
    app.post('/tasks', async (request, reply) => {
        // Deve ser possível criar uma task no banco de dados, enviando os campos `title` e `description` por meio do `body` da requisição.
        // Ao criar uma task, os campos: `id`, `created_at`, `updated_at` e `completed_at` devem ser preenchidos automaticamente, conforme a orientação das propriedades acima.
        
        const createTaskBodySchema = z.object({
            title: z.string(),
            description: z.string(),
        });

        const {title, description} = createTaskBodySchema.parse(request.body);

        await prisma.task.create({
            data: {
                title,
                description,      
            }
        });

        return reply.status(201).send();
    });

    app.get('/tasks', async (request, reply)=>{
        // Deve ser possível listar todas as tasks salvas no banco de dados.
        // Também deve ser possível realizar uma busca, filtrando as tasks pelo `title` e `description`

        const querySchema = z.object({
            title: z.string().optional(),
            description: z.string().optional()
        });
    
        const validatedQuery = querySchema.safeParse(request.query);
    
        if (!validatedQuery.success) {
            return reply.status(400).send('Parâmetros de consulta inválidos');
        }
    
        const { title, description } = validatedQuery.data;
    
        const filter: { title?: { contains: string }; description?: { contains: string } } = {};

        if (title) {
            filter.title = { contains: title };
        }
        if (description) {
            filter.description = { contains: description };
        }
    
        const tasks = await prisma.task.findMany({
            where: filter,
        });
    
        return reply.status(200).send({ tasks });
    });

    app.put('/tasks/:id', ()=>{
        // Deve ser possível atualizar uma task pelo `id`.

        // No `body` da requisição, deve receber somente o `title` e/ou `description` para serem atualizados.

        // Se for enviado somente o `title`, significa que o `description` não pode ser atualizado e vice-versa.

        // Antes de realizar a atualização, deve ser feito uma validação se o `id` pertence a uma task salva no banco de dados.
    });

    app.delete('/tasks/:id', async (request, reply)=>{
        // Deve ser possível remover uma task pelo `id`.

        // Antes de realizar a remoção, deve ser feito uma validação se o `id` pertence a uma task salva no banco de dados.
        const queryDeleteSchema = z.object({
            id: z.string().uuid()
        });

        const queryDeleteTask = queryDeleteSchema.parse(request.params);

        const toDeleteTask = await prisma.task.findUnique({
            where: {
                id: queryDeleteTask.id
            }
        });

        if(!toDeleteTask){
            return reply.status(404).send();
        }

        await prisma.task.delete({
            where: {
                id: queryDeleteTask.id
            }
        });

        return reply.status(200).send();
    });

    app.patch('/tasks/:id/complete', ()=>{
        // Deve ser possível marcar a task como completa ou não. Isso significa que se a task estiver concluída, deve voltar ao seu estado “normal”.

        // Antes da alteração, deve ser feito uma validação se o `id` pertence a uma task salva no banco de dados.
    });
}