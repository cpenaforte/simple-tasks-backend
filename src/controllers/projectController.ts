import {
  Request, Response,
} from 'express';
import i18n from 'i18next';
/* eslint-disable no-unused-vars */
import {
  fetchUserProjects,
  fetchSingleProject,
  insertProject,
  patchProject,
  removeProject,
} from '../services/projectService';
import { isProject } from '../utils/typeCheck';
import { Project } from '../models/project';


export const getProjects = async (request: Request, response: Response): Promise<void> => {
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

    await fetchUserProjects(
      token,
      userId,
      (tasks: Project[]) => response.status(200).json({
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

export const getSingleProject = async (request: Request, response: Response): Promise<void> => {
  const strProjectId = request.params.id;
  if (typeof strProjectId === 'string') {
    const taskId: number = parseInt(strProjectId);

    const { token } = request.headers;
    if (typeof token !== 'string') {
      response.status(404).json({
        message: i18n.t('TOKEN.NOT_FOUND'), hasError: true,
      });

      return;
    }

    await fetchSingleProject(
      token,
      taskId,
      (task: Project) => response.status(200).json({
        task, hasError: false,
      }),
      (message: string | object) => response.status(403).json({
        message, hasError: true,
      }));
  } else {
    response.status(403).json({
      message: i18n.t('PROJECT.INVALID_ID'), hasError: true,
    });
  }
};

export const createProject = async (request: Request, response: Response): Promise<void> => {
  const { token } = request.headers;
  if (typeof token !== 'string') {
    response.status(404).json({
      message: i18n.t('TOKEN.NOT_FOUND'), hasError: true,
    });

    return;
  }

  const { task } = request.body;
  if (!isProject(task)) {
    response.status(403).json({
      message: i18n.t('PROJECT.WRONG_TYPE'), hasError: true,
    });

    return;
  }

  await insertProject(
    token,
    task,
    (answer: string | object) => response.status(201).json({
      message: answer, hasError: false,
    }),
    (message: string | object) => response.status(403).json({
      message, hasError: true,
    }));
};

export const updateProject = async (request: Request, response: Response): Promise<void> => {
  const strProjectId = request.params.id;
  if (typeof strProjectId === 'string') {
    const taskId: number = parseInt(strProjectId);

    const { token } = request.headers;
    if (typeof token !== 'string') {
      response.status(404).json({
        message: i18n.t('TOKEN.NOT_FOUND'), hasError: true,
      });

      return;
    }

    const { task } = request.body;
    if (!isProject(task)) {
      response.status(403).json({
        message: i18n.t('PROJECT.WRONG_TYPE'), hasError: true,
      });

      return;
    }

    await patchProject(
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
      message: i18n.t('PROJECT.INVALID_ID'), hasError: true,
    });
  }
};

export const deleteProject = async (request: Request, response: Response): Promise<void> => {
  const strProjectId = request.params.id;
  if (typeof strProjectId === 'string') {
    const taskId: number = parseInt(strProjectId);

    const { token } = request.headers;
    if (typeof token !== 'string') {
      response.status(404).json({
        message: i18n.t('TOKEN.NOT_FOUND'), hasError: true,
      });

      return;
    }

    await removeProject(
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
      message: i18n.t('PROJECT.INVALID_ID'), hasError: true,
    });
  }
};