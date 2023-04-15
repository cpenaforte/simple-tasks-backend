import express from 'express';
const router = express.Router();

import {
  getTasks, getSharedTasks, getSingleTask, createTask, updateTask, deleteTask,
} from '../controllers/taskController';

router.get('/:id', getTasks);
router.get('/shared/:id', getSharedTasks);
router.get('/single/:id', getSingleTask);
router.post('/', createTask);
router.put('/single/:id', updateTask);
router.delete('/single/:id', deleteTask);

export default router;