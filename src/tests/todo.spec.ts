import { app } from '../app';
import { execSync } from 'node:child_process';
import { test, beforeAll, afterAll, describe, beforeEach, expect } from 'vitest';
import request from 'supertest';
import { Prisma } from '@prisma/client';


describe('Task Routes', ()=> {
    beforeAll(async () => {
        await app.ready();
    });
    
    // tudo que tiver aqui roda depois dos testes
    afterAll(async () => {
        await app.close();
    });
    
    beforeEach(async () => {
        execSync('npx prisma migrate reset --force');
    });


    test('User can create a new task', async () => {

        const data: Prisma.TaskCreateInput = {
            title: 'New task exemple',
            description: 'Description exemple'
        };

        await request(app.server)
            .post('/tasks')
            .send(data)
            .expect(201);
    });
    
    test('User cant create a new task without parameters', async () => {

        const data = {};

        await request(app.server)
            .post('/tasks')
            .send(data)
            .expect(400);
    });

    test('User can get all tasks', async () => {
        // Criação das tasks
        const data_1: Prisma.TaskCreateInput = {
            title: 'New task exemple 1',
            description: 'Description exemple'
        };

        await request(app.server)
            .post('/tasks')
            .send(data_1);

        const data_2: Prisma.TaskCreateInput = {
            title: 'New task exemple 2',
            description: 'Description exemple'
        };

        await request(app.server)
            .post('/tasks')
            .send(data_2);

        // Solicitação para obter todas as tasks
        const getAllTasksResponse = await request(app.server)
            .get('/tasks');

        // Verifica se a resposta contém um objeto 'tasks'
        expect(getAllTasksResponse.body).toHaveProperty('tasks');
        // Verifica se o objeto 'tasks' contém exatamente 2 itens

        expect(getAllTasksResponse.body.tasks).toHaveLength(2);
    
        // Verifica se os itens específicos estão presentes no array 'tasks'
        expect(getAllTasksResponse.body.tasks).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    title: 'New task exemple 1',
                    description: 'Description exemple'
                }),
                expect.objectContaining({
                    title: 'New task exemple 2',
                    description: 'Description exemple'
                })
            ])
        );
    });

    test('User can filter tasks by title', async () => {
        // Criação das tasks
        const data_1: Prisma.TaskCreateInput = {
            title: 'New task exemple 1',
            description: 'Description exemple'
        };

        await request(app.server)
            .post('/tasks')
            .send(data_1);

        const data_2: Prisma.TaskCreateInput = {
            title: 'Another text',
            description: 'Another text'
        };
    
        await request(app.server)
            .post('/tasks')
            .send(data_2);
    

        // Solicitação para obter todas as tasks
        const getAllTasksResponse = await request(app.server)
            .get('/tasks?title=New task exemple 1');

        // Verifica se a resposta contém um objeto 'tasks'
        expect(getAllTasksResponse.body).toHaveProperty('tasks');
        // Verifica se o objeto 'tasks' contém exatamente 2 itens

        expect(getAllTasksResponse.body.tasks).toHaveLength(1);
    
        // Verifica se os itens específicos estão presentes no array 'tasks'
        expect(getAllTasksResponse.body.tasks).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    title: 'New task exemple 1',
                    description: 'Description exemple'
                })               
            ])
        );
    });

    test('User can filter tasks by description', async () => {
        // Criação das tasks
        const data_1: Prisma.TaskCreateInput = {
            title: 'New task exemple 1',
            description: 'Description exemple'
        };

        await request(app.server)
            .post('/tasks')
            .send(data_1);

        const data_2: Prisma.TaskCreateInput = {
            title: 'Another text',
            description: 'Another text'
        };
    
        await request(app.server)
            .post('/tasks')
            .send(data_2);
    

        // Solicitação para obter todas as tasks
        const getAllTasksResponse = await request(app.server)
            .get('/tasks?description=Description exemple');

        // Verifica se a resposta contém um objeto 'tasks'
        expect(getAllTasksResponse.body).toHaveProperty('tasks');
        // Verifica se o objeto 'tasks' contém exatamente 2 itens

        expect(getAllTasksResponse.body.tasks).toHaveLength(1);
    
        // Verifica se os itens específicos estão presentes no array 'tasks'
        expect(getAllTasksResponse.body.tasks).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    title: 'New task exemple 1',
                    description: 'Description exemple'
                })               
            ])
        );
    });

    test('User can delete a task using id', async () => {
        const data_1: Prisma.TaskCreateInput = {
            title: 'New task exemple 1',
            description: 'Description exemple'
        };

        await request(app.server)
            .post('/tasks')
            .send(data_1);

        const resp = await request(app.server)
            .get('/tasks');

        const id_task = resp.body.tasks[0].id;
        
        await request(app.server)
            .delete(`/tasks/${id_task}`)
            .expect(200);
    });

    test('User can edit a task using id', async () => {
        const data_1: Prisma.TaskCreateInput = {
            title: 'New task exemple 1',
            description: 'Description exemple'
        };

        await request(app.server)
            .post('/tasks')
            .send(data_1);

        const resp = await request(app.server)
            .get('/tasks');

        const id_task = resp.body.tasks[0].id;
        
        const task_chenged = await request(app.server)
            .put(`/tasks/${id_task}`)
            .send({
                title: 'New task exemple 1 (changed)',
                description: 'Description exemple 1 (changed)'
            })
            .expect(200);
        
        expect(task_chenged.body).toHaveProperty('tasks');
    
        expect(task_chenged.body.tasks).toHaveLength(1);

        expect(task_chenged.body.tasks).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    title: 'New task exemple 1 (changed)',
                    description: 'Description exemple 1 (changed)'
                })               
            ])
        );

    });

    test('User can complete a task using id', async () => {
        const data_1: Prisma.TaskCreateInput = {
            title: 'New task exemple 1',
            description: 'Description exemple'
        };

        await request(app.server)
            .post('/tasks')
            .send(data_1);

        const resp = await request(app.server)
            .get('/tasks');

        const id_task = resp.body.tasks[0].id;

        const task_chenged = await request(app.server)
            .patch(`/tasks/${id_task}/completed`)
            .expect(200);

        const task_completed = task_chenged.body.tasks[0].completed_at;
        
        expect(task_chenged.body).toHaveProperty('tasks');
    
        expect(task_chenged.body.tasks).toHaveLength(1);

        expect(task_chenged.body.tasks).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    completed_at: task_completed
                })               
            ])
        );
    });

    test('User can uncomplete a task using id', async () => {
        const data_1: Prisma.TaskCreateInput = {
            title: 'New task exemple 1',
            description: 'Description exemple'
        };

        await request(app.server)
            .post('/tasks')
            .send(data_1);

        const resp = await request(app.server)
            .get('/tasks');

        const id_task = resp.body.tasks[0].id;

        await request(app.server)
            .patch(`/tasks/${id_task}/completed`)
            .expect(200);

        const task_uncompleted = await request(app.server)
            .patch(`/tasks/${id_task}/uncompleted`)
            .expect(200);

        expect(task_uncompleted.body).toHaveProperty('tasks');
    
        expect(task_uncompleted.body.tasks).toHaveLength(1);

        expect(task_uncompleted.body.tasks).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    completed_at: null
                })               
            ])
        );
    });

});