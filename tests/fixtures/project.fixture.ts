
import {
    Project, ReceivedProject,
} from '../../src/models/project';

export const sampleProject = (id = 1): Project => ({
    project_id: id,
    user_id: 1,
    name: 'Test Project',
    description: 'test',
});

export const sampleAllProjects = (id = 1) : Project[] => [sampleProject(id)];

export const updatedSampleProject = (id = 1): Project => ({
    project_id: id,
    user_id: 1,
    name: 'Test Project',
    description: 'test2',
});

export const createReceivedSampleProject: ReceivedProject ={
    user_id: 1,
    name: 'Test Project',
    description: 'test',
};

export const updateReceivedSampleProject: ReceivedProject ={
    user_id: 1,
    name: 'Test Project',
    description: 'test2',
};