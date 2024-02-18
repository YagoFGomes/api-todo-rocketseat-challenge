import { app } from '../app';
import { execSync } from 'node:child_process';
import { test, beforeAll, afterAll, describe, beforeEach } from 'vitest';
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
});