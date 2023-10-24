import {
    TaskToSend, ReceivedTask,
} from '../../src/models/task';

export const sampleTask = (id = 1, projectId = 1): TaskToSend => ({
    task_id: id,
    user_id: 1,
    project_id: projectId,
    task_title: 'Test Task',
    task_description: 'test',
    urgency: 'urgent',
    creation_date: '2023-10-12T00:00:00.000Z',
    due_date: '2023-10-30T00:00:00.000Z',
    done: 0,
});
export const sampleAllTasks = (id = 1, projectId = 1): TaskToSend[] => [sampleTask(id, projectId)];

export const updatedSampleTask = (id = 1, projectId = 1): TaskToSend => ({
    task_id: id,
    user_id: 1,
    project_id: projectId,
    task_title: 'Test Task',
    task_description: 'test2',
    urgency: 'urgent',
    creation_date: '2023-10-12T00:00:00.000Z',
    due_date: '2023-10-30T00:00:00.000Z',
    done: 0,
});

export const createReceivedSampleTask = (projectId = 1): ReceivedTask => ({
    user_id: 1,
    project_id: projectId,
    task_title: 'Test Task',
    task_description: 'test',
    urgency: 'urgent',
    creation_date: '2023-10-12T00:00:00.000Z',
    due_date: '2023-10-30T00:00:00.000Z',
    done: 0,
});

export const updateReceivedSampleTask = (projectId = 1): ReceivedTask => ({
    user_id: 1,
    project_id: projectId,
    task_title: 'Test Task',
    task_description: 'test2',
    urgency: 'urgent',
    creation_date: '2023-10-12T00:00:00.000Z',
    due_date: '2023-10-30T00:00:00.000Z',
    done: 0,
});