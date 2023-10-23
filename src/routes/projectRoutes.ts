import express from 'express';
const router = express.Router();

import {
    getProjects, getSingleProject, createProject, updateProject, deleteProject,
} from '../controllers/projectController';

router.get('/users/:user_id/projects', getProjects);
router.get('/users/:user_id/projects/:project_id', getSingleProject);
router.post('/users/:user_id/projects', createProject);
router.put('/users/:user_id/projects/:project_id', updateProject);
router.delete('/users/:user_id/projects/:project_id', deleteProject);

export default router;