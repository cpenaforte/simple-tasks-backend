/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import jwt from 'jsonwebtoken';
import pool from '../config/pg';
import { PoolClient } from 'pg';
import { Response } from 'express';
import i18n from 'i18next';
import {
  Project, ReceivedProject,
} from '../models/project';

export const fetchUserProjects = async (
  token: string,
  userId: number,
  onSuccess: (message: Project[]) => Response<unknown, Record<string, unknown>> | Promise<void>,
  onError: (message: string) => Response<unknown, Record<string, unknown>> | Promise<void>,
): Promise<void> => {
  if (process.env.TOKEN_KEY) {
    const client: PoolClient = await pool.connect();
    await client.query('BEGIN');
    jwt.verify(token, process.env.TOKEN_KEY, async (e, _decoded) => {
      if (e) {
        onError(i18n.t('TOKEN.AUTH_FAILED'));
        await client.query('ROLLBACK');
        return;
      }

      client.query(
        'SELECT * FROM projects WHERE user_id = $1',
        [userId],
        async (error, results) => {
          if (error) {
            onError(error.message);
            await client.query('ROLLBACK');
            return;
          }

          onSuccess(results.rows);
          await client.query('COMMIT');
        });
    });
    client.release();
  } else {
    onError(i18n.t('TOKEN.NOT_FOUND'));
  }
};

export const fetchSingleProject = async (
  token: string,
  userId: number,
  projectId: number,
  onSuccess: (message: Project) => Response<unknown, Record<string, unknown>> | Promise<void>,
  onError: (message: string) => Response<unknown, Record<string, unknown>> | Promise<void>,
): Promise<void> => {
  if (process.env.TOKEN_KEY) {
    const client: PoolClient = await pool.connect();
    await client.query('BEGIN');
    jwt.verify(token, process.env.TOKEN_KEY, async (e, _decoded) => {
      if (e) {
        onError(i18n.t('TOKEN.AUTH_FAILED'));
        await client.query('ROLLBACK');
        return;
      }

      client.query(
        'SELECT * FROM projects WHERE project_id = $1 AND user_id = $2',
        [ projectId, userId ],
        async (error, results) => {
          if (error) {
            onError(error.message);
            await client.query('ROLLBACK');
            return;
          }

          onSuccess(results.rows[0]);
          await client.query('COMMIT');
        });
    });
    client.release();
  } else {
    onError(i18n.t('TOKEN.NOT_FOUND'));
  }
};

export const insertProject = async (
  token: string,
  userId: number,
  project: ReceivedProject,
  onSuccess: (projects: Project[]) => Response<unknown, Record<string, unknown>> | Promise<void>,
  onError: (message: string) => Response<unknown, Record<string, unknown>> | Promise<void>,
): Promise<void> => {
  if (process.env.TOKEN_KEY) {
    const client: PoolClient = await pool.connect();
    await client.query('BEGIN');
    jwt.verify(token, process.env.TOKEN_KEY, async (e, _decoded) => {
      if (e) {
        onError(i18n.t('TOKEN.AUTH_FAILED'));
        await client.query('ROLLBACK');
        return;
      }

      const {
        user_id, name, description,
      } = project;

      if (user_id !== userId) {
        onError(i18n.t('USER.ID_NOT_FOUND'));
        await client.query('ROLLBACK');
        return;
      }

      client.query('INSERT INTO projects (user_id, name, description) values ($1,$2,$3)', [
        user_id, name, description,
      ], async (error, __results) => {
        if (error) {
          onError(error.message);
          await client.query('ROLLBACK');
          return;
        }

        client.query(
          'SELECT * FROM projects WHERE user_id = $1',
          [userId],
          async (error, results) => {
            if (error) {
              onError(error.message);
              await client.query('ROLLBACK');
              return;
            }

            onSuccess(results.rows);
            await client.query('COMMIT');
          });
      });
    });
    client.release();
  } else {
    onError(i18n.t('TOKEN.NOT_FOUND'));
  }
};

export const patchProject = async (
  token: string,
  userId: number,
  projectId: number,
  project: ReceivedProject,
  onSuccess: (project: Project) => Response<unknown, Record<string, unknown>> | Promise<void>,
  onError: (message: string) => Response<unknown, Record<string, unknown>> | Promise<void>,
): Promise<void> => {
  if (process.env.TOKEN_KEY) {
    const client: PoolClient = await pool.connect();
    await client.query('BEGIN');
    jwt.verify(token, process.env.TOKEN_KEY, async (e, _decoded) => {
      if (e) {
        onError(i18n.t('TOKEN.AUTH_FAILED'));
        await client.query('ROLLBACK');
        return;
      }

      const {
        user_id, name, description,
      } = project;

      if (user_id !== userId) {
        onError(i18n.t('USER.ID_NOT_FOUND'));
        await client.query('ROLLBACK');
        return;
      }

      await fetchSingleProject(token, userId, projectId, async (project) => {
        if (!project) {
          onError(i18n.t('PROJECT.NOT_FOUND'));
          await client.query('ROLLBACK');
          return;
        }

        client.query('UPDATE projects SET (project_id, user_id, name, description) = ($1,$2,$3) WHERE project_id = $4', [
          user_id, name, description, projectId,
        ], async (error, _results) => {
          if (error) {
            onError(error.message);
            await client.query('ROLLBACK');
            return;
          }

          onSuccess({
            ...project, project_id: projectId,
          });
          await client.query('COMMIT');
        });
      }, (message: string) => onError(message));
    });
    client.release();
  } else {
    onError(i18n.t('TOKEN.NOT_FOUND'));
  }
};

export const removeProject = async (
  token: string,
  userId: number,
  projectId: number,
  onSuccess: (message: string) => Response<unknown, Record<string, unknown>> | Promise<void>,
  onError: (message: string) => Response<unknown, Record<string, unknown>> | Promise<void>,
): Promise<void> => {
  if (process.env.TOKEN_KEY) {
    const client: PoolClient = await pool.connect();
    await client.query('BEGIN');
    jwt.verify(token, process.env.TOKEN_KEY, async (e, _decoded) => {
      if (e) {
        onError(i18n.t('TOKEN.AUTH_FAILED'));
        await client.query('ROLLBACK');
        return;
      }

      await fetchSingleProject(token, userId, projectId, async (project) => {
        if (!project) {
          onError(i18n.t('PROJECT.NOT_FOUND'));
          await client.query('ROLLBACK');
          return;
        }

        if (project.user_id !== userId) {
          onError(i18n.t('USER.ID_NOT_FOUND'));
          await client.query('ROLLBACK');
          return;
        }

        await client.query('DELETE FROM projects WHERE project_id = $1', [projectId])
          .catch(async (error) => {
            onError(error.message);
            await client.query('ROLLBACK');
            return;
          });

        await client.query('DELETE FROM tasks WHERE project_id = $1', [projectId])
          .catch(async (error) => {
            onError(error.message);
            await client.query('ROLLBACK');
            return;
          });

        onSuccess(i18n.t('PROJECT.DELETED'));
        await client.query('COMMIT');
      }, (message: string) => onError(message));
    });

    client.release();
  } else {
    onError(i18n.t('TOKEN.NOT_FOUND'));
  }
};