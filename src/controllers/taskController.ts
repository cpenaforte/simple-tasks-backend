import {
  Request, Response,
} from 'express';
import { DefaultTFuncReturn } from 'i18next';
/* eslint-disable no-unused-vars */
import {
  fetchUserTasks,
  fetchSharedTasks,
  fetchSingleTask,
  insertTask,
  patchTask,
  removeTask,
} from '../services/taskService';


export const getTasks = async (request: Request, response: Response): Promise<void> => {
  const userId = parseInt(request.params.id);
  const { token } = request.body;

  await fetchUserTasks(
    token,
    userId,
    (users: object) => response.status(200).json({
      users, hasError: false,
    }),
    (message: string | object | DefaultTFuncReturn) => response.status(403).json({
      message, hasError: true,
    }));
};

export const getSharedTasks = async (request: Request, response: Response): Promise<void> => {
  const userId = parseInt(request.params.id);
  const { token } = request.body;

  await fetchSharedTasks(
    token,
    userId,
    (user: object) => response.status(200).json({
      user, hasError: false,
    }),
    (message: string | object | DefaultTFuncReturn) => response.status(403).json({
      message, hasError: true,
    }));
};

export const getSingleTask = async (request: Request, response: Response): Promise<void> => {
  const taskId: number = parseInt(request.params.id);

  const {
    token,
  } = request.body;

  await fetchSingleTask(
    token,
    taskId,
    (user: object) => response.status(200).json({
      user, hasError: false,
    }),
    (message: string | object | DefaultTFuncReturn) => response.status(403).json({
      message, hasError: true,
    }));
};

export const createTask = async (request: Request, response: Response): Promise<void> => {
  const {
    token, task,
  } = request.body;

  await insertTask(
    token,
    task,
    (answer: string | object | DefaultTFuncReturn) => response.status(201).json({
      message: answer, hasError: false,
    }),
    (message: string| object | DefaultTFuncReturn) => response.status(403).json({
      message, hasError: true,
    }));
};

export const updateTask = async (request: Request, response: Response): Promise<void> => {
  const taskId: number = parseInt(request.params.id);

  const {
    task, token,
  } = request.body;

  await patchTask(
    token,
    taskId,
    task,
    (answer: string | object | DefaultTFuncReturn) => response.status(200).json({
      message: answer, hasError: false,
    }),
    (message: string | object | DefaultTFuncReturn) => response.status(403).json({
      message, hasError: true,
    }));
};

export const deleteTask = async (request: Request, response: Response): Promise<void> => {
  const taskId: number = parseInt(request.params.id);
  const { token } = request.body;

  await removeTask(
    token,
    taskId,
    (answer: string | object | DefaultTFuncReturn) => response.status(202).json({
      message: answer, hasError: false,
    }),
    (message: object | DefaultTFuncReturn) => response.status(403).json({
      message, hasError: true,
    }));
};