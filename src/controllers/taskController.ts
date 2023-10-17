import {
  Request, Response,
} from 'express';
import i18n from 'i18next';
/* eslint-disable no-unused-vars */
import {
  fetchUserTasks,
  fetchSingleTask,
  insertTask,
  patchTask,
  removeTask,
} from '../services/taskService';
import { isReceivedTask } from '../utils/typeCheck';
import { TaskToSend } from '../models/task';


export const getTasks = async (request: Request, response: Response): Promise<void> => {
  const strUserId = request.params.user_id;
  if (typeof strUserId === 'string') {
    const userId = parseInt(strUserId);

    const { token } = request.headers;
    if (typeof token !== 'string') {
      response.status(404).json({
        message: i18n.t('TOKEN.NOT_FOUND'), hasError: true,
      });

      return;
    }

    await fetchUserTasks(
      token,
      userId,
      (tasks: TaskToSend[]) => response.status(200).json({
        tasks, hasError: false,
      }),
      (message: string) => response.status(403).json({
        message, hasError: true,
      }));
  } else {
    response.status(403).json({
      message: i18n.t('USER.INVALID_ID'), hasError: true,
    });
  }
};

export const getSingleTask = async (request: Request, response: Response): Promise<void> => {
  const strTaskId = request.params.task_id;
  const strUserId = request.params.user_id;
  if (typeof strTaskId === 'string' && typeof strUserId === 'string') {
    const taskId: number = parseInt(strTaskId);
    const userId: number = parseInt(strUserId);

    const { token } = request.headers;
    if (typeof token !== 'string') {
      response.status(404).json({
        message: i18n.t('TOKEN.NOT_FOUND'), hasError: true,
      });

      return;
    }

    await fetchSingleTask(
      token,
      userId,
      taskId,
      (task: TaskToSend) => response.status(200).json({
        task, hasError: false,
      }),
      (message: string) => response.status(403).json({
        message, hasError: true,
      }));
  } else {
    response.status(403).json({
      message: i18n.t('TASK.INVALID_ID'), hasError: true,
    });
  }
};

export const createTask = async (request: Request, response: Response): Promise<void> => {
  const strUserId = request.params.user_id;
  if (typeof strUserId === 'string') {
    const userId = parseInt(strUserId);
    const { token } = request.headers;
    if (typeof token !== 'string') {
      response.status(404).json({
        message: i18n.t('TOKEN.NOT_FOUND'), hasError: true,
      });

      return;
    }

    const { task } = request.body;
    if (!isReceivedTask(task)) {
      response.status(403).json({
        message: i18n.t('TASK.WRONG_TYPE'), hasError: true,
      });

      return;
    }

    if (task.user_id !== userId) {
      response.status(403).json({
        message: i18n.t('USER.INVALID_ID'), hasError: true,
      });

      return;
    }

    await insertTask(
      token,
      userId,
      task,
      (tasks: TaskToSend[]) => response.status(201).json({
        tasks, hasError: false,
      }),
      (message: string) => response.status(403).json({
        message, hasError: true,
      }));
  } else {
    response.status(403).json({
      message: i18n.t('USER.INVALID_ID'), hasError: true,
    });
  }
};

export const updateTask = async (request: Request, response: Response): Promise<void> => {
  const strTaskId = request.params.task_id;
  const strUserId = request.params.user_id;
  if (typeof strTaskId === 'string' && typeof strUserId === 'string') {
    const taskId: number = parseInt(strTaskId);
    const userId = parseInt(strUserId);

    const { token } = request.headers;
    if (typeof token !== 'string') {
      response.status(404).json({
        message: i18n.t('TOKEN.NOT_FOUND'), hasError: true,
      });

      return;
    }

    const { task } = request.body;
    if (!isReceivedTask(task)) {
      response.status(403).json({
        message: i18n.t('TASK.WRONG_TYPE'), hasError: true,
      });

      return;
    }

    await patchTask(
      token,
      userId,
      taskId,
      task,
      (task: TaskToSend) => response.status(200).json({
        task, hasError: false,
      }),
      (message: string | object) => response.status(403).json({
        message, hasError: true,
      }));
  } else {
    response.status(403).json({
      message: i18n.t('TASK.INVALID_ID'), hasError: true,
    });
  }
};

export const deleteTask = async (request: Request, response: Response): Promise<void> => {
  const strTaskId = request.params.task_id;
  const strUserId = request.params.user_id;
  if (typeof strTaskId === 'string' && typeof strUserId === 'string') {
    const taskId: number = parseInt(strTaskId);
    const userId = parseInt(strUserId);

    const { token } = request.headers;
    if (typeof token !== 'string') {
      response.status(404).json({
        message: i18n.t('TOKEN.NOT_FOUND'), hasError: true,
      });

      return;
    }

    await removeTask(
      token,
      userId,
      taskId,
      (message: string) => response.status(202).json({
        message, hasError: false,
      }),
      (message: string) => response.status(403).json({
        message, hasError: true,
      }));
  } else {
    response.status(403).json({
      message: i18n.t('TASK.INVALID_ID'), hasError: true,
    });
  }
};