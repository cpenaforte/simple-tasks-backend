import express from 'express';
const router = express.Router();

import {
  getProjects, getSingleProject, createProject, updateProject, deleteProject,
} from '../controllers/projectController';

router.get('/:id', getProjects);
router.get('/single/:id', getSingleProject);
router.post('/', createProject);
router.put('/single/:id', updateProject);
router.delete('/single/:id', deleteProject);

export default router;