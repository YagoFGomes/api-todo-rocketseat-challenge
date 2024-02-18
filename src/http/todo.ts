import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

export async function toDoRoutes(app: FastifyInstance){
    app.post('/tasks', async (request, reply) => {

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

    app.delete('/tasks/:id', async (request, reply)=>{
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

    app.put('/tasks/:id', async (request, reply) => {
        // Passo 1: Capturar o 'id' da URL

        const idTaskParams = z.object({
            id: z.string().uuid(),
        });

        const { id } = idTaskParams.parse(request.params);
    
        // Passo 2: Validar e Extrair os Dados do 'body' da Requisição
        const toUpdateSchema = z.object({
            title: z.string().optional(),
            description: z.string().optional()
        });
    
        // Validar o 'body' da requisição
        const validationResult = toUpdateSchema.safeParse(request.body);
        if (!validationResult.success) {
            return reply.status(400).send();
        }
    
        const updateData = validationResult.data;
    
        // Passo 3: Verificar se a Task com o 'id' fornecido existe
        const existingTask = await prisma.task.findUnique({ where: { id } });

        if (!existingTask) {
            return reply.status(404).send();
        }
    
        // Passo 4: Atualizar a Task no Banco de Dados
        const updatedTask = await prisma.task.update({
            where: { id: id },
            data: updateData
        });
    
        return reply.status(200).send(updatedTask);
    });
    
    app.patch('/tasks/:id/complete', async (request, reply)=>{
        const idTaksParams = z.object({
            id: z.string().uuid()
        });

        const { id } = idTaksParams.parse(request.params);

        const taskExists = await prisma.task.findUnique({
            where: {id}
        });

        if(!taskExists){
            return reply.status(404).send();
        }

        const taskToComplete = await prisma.task.update({
            where: { id },
            data: {
                completed_at: new Date()
            }
        });
        
        return reply.status(200).send({task: taskToComplete});
    });
}