import {
    Task, Urgency,
} from '../../src/models/task';

export const sampleTask: Task = {
    task_id: 1,
    user_id: 1,
    project_id: 1,
    task_title: 'Test Task',
    task_description: 'test',
    urgency: Urgency.URGENT,
    creation_date: new Date('2023-10-12'),
    due_date: new Date('2023-10-30'),
    done: 0,
};