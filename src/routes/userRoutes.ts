import express from 'express';
const router = express.Router();

import {
  getUsers, getUserById, createUser, updateUser, deleteUserById,
} from '../controllers/userController';

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUserById);

export default router;