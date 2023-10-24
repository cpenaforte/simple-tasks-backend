import request from 'supertest';

import app from '../../src/app';

import {
    sampleProject, createReceivedSampleProject, sampleAllProjects, updatedSampleProject, updateReceivedSampleProject,
} from '../fixtures/project.fixture';

import migrate from '../../src/migrations/index';

beforeAll(async() => {
    await migrate();
});

describe('Project routes', () => {
    let token = '';
    let projectId = 1;

    beforeAll(async () => {
        const response = await request(app).post('/auth/login').send({
            email: 'test@simpletasks.com.br', password: '123456',
        }).timeout(10000);

        expect(response.status).toEqual(200);

        // eslint-disable-next-line prefer-destructuring
        token = response.body.token;
    });

    test('Create a project', async () => {
        const res = await request(app).post('/api/v1/users/1/projects').set('token', token).send({ project: createReceivedSampleProject });

        expect(res.status).toEqual(201);

        expect(res.body.projects.length).toBeGreaterThan(0);

        projectId = res.body.projects[0].project_id;
    });

    test('Get all projects', async () => {
        const res = await request(app).get('/api/v1/users/1/projects').set('token', token);

        expect(res.body.projects).toEqual(sampleAllProjects(projectId));
    });

    test('Get project by id', async () => {
        const res = await request(app).get(`/api/v1/users/1/projects/${projectId}`).set('token', token);
        expect(res.body.project).toEqual(sampleProject(projectId));
    });

    test('Update project', async () => {
        const res = await request(app).put(`/api/v1/users/1/projects/${projectId}`).set('token', token).send({ project: updateReceivedSampleProject });
        expect(res.body.project).toEqual(updatedSampleProject(projectId));
    });

    test('Delete project', async () => {
        const res = await request(app).delete(`/api/v1/users/1/projects/${projectId}`).set('token', token);
        expect(res.status).toEqual(202);
    });
});