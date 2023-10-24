import request from 'supertest';

import app from '../../src/app';

import {
    updatedSampleTask, createReceivedSampleTask, updateReceivedSampleTask, sampleAllTasks, sampleTask,
} from '../fixtures/task.fixture';
import { createReceivedSampleProject } from '../fixtures/project.fixture';

import migrate from '../../src/migrations/index';

beforeAll(async() => {
    await migrate();
});

describe('Task routes', () => {
    let token = '';
    let projectId = 1;
    let taskId = 1;

    beforeAll(async () => {
        const response = await request(app).post('/auth/login').send({
            email: 'test@simpletasks.com.br', password: '123456',
        }).timeout(10000);

        expect(response.status).toEqual(200);

        // eslint-disable-next-line prefer-destructuring
        token = response.body.token;

        const projectResponse = await request(app).post('/api/v1/users/1/projects').set('token', token).send({ project: createReceivedSampleProject });

        expect(projectResponse.status).toEqual(201);

        expect(projectResponse.body.projects.length).toBeGreaterThan(0);

        projectId = projectResponse.body.projects[0].project_id;
    });

    test('Create a task', async () => {
        const res = await request(app).post('/api/v1/users/1/tasks').set('token', token).send({ task: createReceivedSampleTask(projectId) });

        expect(res.status).toEqual(201);

        expect(res.body.tasks.length).toBeGreaterThan(0);

        taskId = res.body.tasks[0].task_id;
    });

    test('Get all tasks', async () => {
        const res = await request(app).get('/api/v1/users/1/tasks').set('token', token);
        expect(res.body.tasks).toEqual(sampleAllTasks(taskId, projectId));
    });

    test('Get task by id', async () => {
        const res = await request(app).get(`/api/v1/users/1/tasks/${taskId}`).set('token', token);
        expect(res.body.task).toEqual(sampleTask(taskId, projectId));
    });

    test('Update task', async () => {
        const res = await request(app).put(`/api/v1/users/1/tasks/${taskId}`).set('token', token).send({ task: updateReceivedSampleTask(projectId) });
        expect(res.body.task).toEqual(updatedSampleTask(taskId, projectId));
    });

    test('Delete task', async () => {
        const res = await request(app).delete(`/api/v1/users/1/tasks/${taskId}`).set('token', token);
        expect(res.status).toEqual(202);

        const projectResponse = await request(app).delete(`/api/v1/users/1/projects/${projectId}`).set('token', token);
        expect(projectResponse.status).toEqual(202);
    });
});