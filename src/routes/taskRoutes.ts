import express from 'express';
const router = express.Router();

import {
    getTasks, getSingleTask, createTask, updateTask, deleteTask,
} from '../controllers/taskController';

router.get('/users/:user_id/tasks', getTasks);
router.get('/users/:user_id/tasks/:task_id', getSingleTask);
router.post('/users/:user_id/tasks', createTask);
router.put('/users/:user_id/tasks/:task_id', updateTask);
router.delete('/users/:user_id/tasks/:task_id', deleteTask);

export default router;