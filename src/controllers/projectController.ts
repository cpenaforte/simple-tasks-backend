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
import { isReceivedProject } from '../utils/typeCheck';
import {
  Project,
} from '../models/project';


export const getProjects = async (request: Request, response: Response): Promise<void> => {
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

    await fetchUserProjects(
      token,
      userId,
      (projects: Project[]) => response.status(200).json({
        projects, hasError: false,
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

export const getSingleProject = async (request: Request, response: Response): Promise<void> => {
  const strProjectId = request.params.project_id;
  const strUserId = request.params.user_id;
  if (typeof strProjectId === 'string' && typeof strUserId === 'string') {
    const projectId: number = parseInt(strProjectId);
    const userId: number = parseInt(strUserId);

    const { token } = request.headers;
    if (typeof token !== 'string') {
      response.status(404).json({
        message: i18n.t('TOKEN.NOT_FOUND'), hasError: true,
      });

      return;
    }

    await fetchSingleProject(
      token,
      userId,
      projectId,
      (project: Project) => response.status(200).json({
        project, hasError: false,
      }),
      (message: string) => response.status(403).json({
        message, hasError: true,
      }));
  } else {
    response.status(403).json({
      message: i18n.t('PROJECT.INVALID_ID'), hasError: true,
    });
  }
};

export const createProject = async (request: Request, response: Response): Promise<void> => {
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

    const { project } = request.body;
    if (!isReceivedProject(project)) {
      response.status(403).json({
        message: i18n.t('PROJECT.WRONG_TYPE'), hasError: true,
      });

      return;
    }

    if (project.user_id !== userId) {
      response.status(403).json({
        message: i18n.t('USER.INVALID_ID'), hasError: true,
      });

      return;
    }

    await insertProject(
      token,
      userId,
      project,
      (projects: Project[]) => response.status(201).json({
        projects, hasError: false,
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

export const updateProject = async (request: Request, response: Response): Promise<void> => {
  const strProjectId = request.params.project_id;
  const strUserId = request.params.user_id;
  if (typeof strProjectId === 'string' && typeof strUserId === 'string') {
    const projectId: number = parseInt(strProjectId);
    const userId: number = parseInt(strUserId);

    const { token } = request.headers;
    if (typeof token !== 'string') {
      response.status(404).json({
        message: i18n.t('TOKEN.NOT_FOUND'), hasError: true,
      });

      return;
    }

    const { project } = request.body;
    if (!isReceivedProject(project)) {
      response.status(403).json({
        message: i18n.t('PROJECT.WRONG_TYPE'), hasError: true,
      });

      return;
    }

    if (project.user_id !== userId) {
      response.status(403).json({
        message: i18n.t('USER.INVALID_ID'), hasError: true,
      });

      return;
    }

    await patchProject(
      token,
      userId,
      projectId,
      project,
      (projectToSend: Project) => response.status(200).json({
        project: projectToSend, hasError: false,
      }),
      (message: string) => response.status(403).json({
        message, hasError: true,
      }));
  } else {
    response.status(403).json({
      message: i18n.t('PROJECT.INVALID_ID'), hasError: true,
    });
  }
};

export const deleteProject = async (request: Request, response: Response): Promise<void> => {
  const strProjectId = request.params.project_id;
  const strUserId = request.params.user_id;
  if (typeof strProjectId === 'string' && typeof strUserId === 'string') {
    const projectId: number = parseInt(strProjectId);
    const userId: number = parseInt(strUserId);

    const { token } = request.headers;
    if (typeof token !== 'string') {
      response.status(404).json({
        message: i18n.t('TOKEN.NOT_FOUND'), hasError: true,
      });

      return;
    }

    await removeProject(
      token,
      userId,
      projectId,
      (answer: string) => response.status(202).json({
        message: answer, hasError: false,
      }),
      (message: string) => response.status(403).json({
        message, hasError: true,
      }));
  } else {
    response.status(403).json({
      message: i18n.t('PROJECT.INVALID_ID'), hasError: true,
    });
  }
};