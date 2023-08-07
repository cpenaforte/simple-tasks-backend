import {
  Request, Response,
} from 'express';
import i18n from 'i18next';
/* eslint-disable no-unused-vars */
import {
  fetchUserTasks,
  fetchSharedTasks,
  fetchSingleTask,
  insertTask,
  patchTask,
  removeTask,
} from '../services/taskService';
import { isReceivedTask } from '../utils/typeCheck';
import { Task } from '../models/task';


export const getTasks = async (request: Request, response: Response): Promise<void> => {
  const strUserId = request.params.id;
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
      (tasks: Task[]) => response.status(200).json({
        tasks, hasError: false,
      }),
      (message: string | object) => response.status(403).json({
        message, hasError: true,
      }));
  } else {
    response.status(403).json({
      message: i18n.t('USER.INVALID_ID'), hasError: true,
    });
  }
};

export const getSharedTasks = async (request: Request, response: Response): Promise<void> => {
  const strUserId = request.params.id;
  if (typeof strUserId === 'string') {
    const userId = parseInt(strUserId);

    const { token } = request.headers;
    if (typeof token !== 'string') {
      response.status(404).json({
        message: i18n.t('TOKEN.NOT_FOUND'), hasError: true,
      });

      return;
    }

    await fetchSharedTasks(
      token,
      userId,
      (tasks: Task[]) => response.status(200).json({
        tasks, hasError: false,
      }),
      (message: string | object) => response.status(403).json({
        message, hasError: true,
      }));
  } else {
    response.status(403).json({
      message: i18n.t('USER.INVALID_ID'), hasError: true,
    });
  }
};

export const getSingleTask = async (request: Request, response: Response): Promise<void> => {
  const strTaskId = request.params.id;
  if (typeof strTaskId === 'string') {
    const taskId: number = parseInt(strTaskId);

    const { token } = request.headers;
    if (typeof token !== 'string') {
      response.status(404).json({
        message: i18n.t('TOKEN.NOT_FOUND'), hasError: true,
      });

      return;
    }

    await fetchSingleTask(
      token,
      taskId,
      (task: Task) => response.status(200).json({
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

export const createTask = async (request: Request, response: Response): Promise<void> => {
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

  await insertTask(
    token,
    task,
    (answer: string | object) => response.status(201).json({
      message: answer, hasError: false,
    }),
    (message: string | object) => response.status(403).json({
      message, hasError: true,
    }));
};

export const updateTask = async (request: Request, response: Response): Promise<void> => {
  const strTaskId = request.params.id;
  if (typeof strTaskId === 'string') {
    const taskId: number = parseInt(strTaskId);

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
      taskId,
      task,
      (answer: string | object) => response.status(200).json({
        message: answer, hasError: false,
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
  const strTaskId = request.params.id;
  if (typeof strTaskId === 'string') {
    const taskId: number = parseInt(strTaskId);

    const { token } = request.headers;
    if (typeof token !== 'string') {
      response.status(404).json({
        message: i18n.t('TOKEN.NOT_FOUND'), hasError: true,
      });

      return;
    }

    await removeTask(
      token,
      taskId,
      (answer: string | object) => response.status(202).json({
        message: answer, hasError: false,
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