/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import jwt from 'jsonwebtoken';
import pool from '../config/pg';
import { PoolClient } from 'pg';
import { Response } from 'express';
import i18n, { DefaultTFuncReturn } from 'i18next';
import {
  Project,
} from '../models/project';

export const fetchUserProjects = async (
  token: string,
  userId: number,
  onSuccess: (message: Project[]) => Response<unknown, Record<string, unknown>> | Promise<void>,
  onError: (message: string | object | DefaultTFuncReturn) => Response<unknown, Record<string, unknown>> | Promise<void>,
): Promise<void> => {
  if (process.env.TOKEN_KEY) {
    const client: PoolClient = await pool.connect();
    await client.query('BEGIN');
    jwt.verify(token, process.env.TOKEN_KEY, async (e, _decoded) => {
      if (e) {
        onError({
          auth: false, message: i18n.t('TOKEN.AUTH_FAILED'),
        });
        await client.query('ROLLBACK');
        return;
      }

      client.query(
        'SELECT * FROM projects WHERE user_id = $1 ORDER BY creation_date DESC',
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
  projectId: number,
  onSuccess: (message: Project) => Response<unknown, Record<string, unknown>> | Promise<void>,
  onError: (message: string | object | DefaultTFuncReturn) => Response<unknown, Record<string, unknown>> | Promise<void>,
): Promise<void> => {
  if (process.env.TOKEN_KEY) {
    const client: PoolClient = await pool.connect();
    await client.query('BEGIN');
    jwt.verify(token, process.env.TOKEN_KEY, async (e, _decoded) => {
      if (e) {
        onError({
          auth: false, message: i18n.t('TOKEN.AUTH_FAILED'),
        });
        await client.query('ROLLBACK');
        return;
      }

      client.query(
        'SELECT * FROM projects WHERE project_id = $1 ORDER BY creation_date DESC',
        [projectId],
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
  project: Project,
  onSuccess: (message: DefaultTFuncReturn) => Response<unknown, Record<string, unknown>> | Promise<void>,
  onError: (message: string | object | DefaultTFuncReturn) => Response<unknown, Record<string, unknown>> | Promise<void>,
): Promise<void> => {
  if (process.env.TOKEN_KEY) {
    const client: PoolClient = await pool.connect();
    await client.query('BEGIN');
    jwt.verify(token, process.env.TOKEN_KEY, async (e, _decoded) => {
      if (e) {
        onError({
          auth: false, message: i18n.t('TOKEN.AUTH_FAILED'),
        });
        await client.query('ROLLBACK');
        return;
      }

      const {
        project_id, user_id, name, description,
      } = project;

      client.query('INSERT INTO projects (project_id, user_id, name, description) values ($1,$2,$3,$4)', [
        project_id, user_id, name, description,
      ], async (error, _results) => {
        if (error) {
          onError(error.message);
          await client.query('ROLLBACK');
          return;
        }

        onSuccess(i18n.t('PROJECT.REGISTERED'));
        await client.query('COMMIT');
      });
    });
    client.release();
  } else {
    onError(i18n.t('TOKEN.NOT_FOUND'));
  }
};

export const patchProject = async (
  token: string,
  projectId: number,
  project: Project,
  onSuccess: (message: DefaultTFuncReturn) => Response<unknown, Record<string, unknown>> | Promise<void>,
  onError: (message: string | object | DefaultTFuncReturn) => Response<unknown, Record<string, unknown>> | Promise<void>,
): Promise<void> => {
  if (process.env.TOKEN_KEY) {
    const client: PoolClient = await pool.connect();
    await client.query('BEGIN');
    jwt.verify(token, process.env.TOKEN_KEY, async (e, _decoded) => {
      if (e) {
        onError({
          auth: false, message: i18n.t('TOKEN.AUTH_FAILED'),
        });
        await client.query('ROLLBACK');
        return;
      }

      const {
        project_id, user_id, name, description,
      } = project;

      await fetchSingleProject(token, projectId, async (project) => {
        if (!project) {
          onError(i18n.t('PROJECT.NOT_FOUND'));
          await client.query('ROLLBACK');
          return;
        }

        client.query('UPDATE projects SET (project_id, user_id, name, description) = ($1,$2,$3) WHERE project_id = $4', [
          user_id, name, description, project_id,
        ], async (error, _results) => {
          if (error) {
            onError(error.message);
            await client.query('ROLLBACK');
            return;
          }

          onSuccess(i18n.t('PROJECT.UPDATED'));
          await client.query('COMMIT');
        });
      }, (message: string | object | DefaultTFuncReturn) => onError(message));
    });
    client.release();
  } else {
    onError(i18n.t('TOKEN.NOT_FOUND'));
  }
};

export const removeProject = async (
  token: string,
  projectId: number,
  onSuccess: (message: DefaultTFuncReturn) => Response<unknown, Record<string, unknown>> | Promise<void>,
  onError: (message: string | object | DefaultTFuncReturn) => Response<unknown, Record<string, unknown>> | Promise<void>,
): Promise<void> => {
  if (process.env.TOKEN_KEY) {
    const client: PoolClient = await pool.connect();
    await client.query('BEGIN');
    jwt.verify(token, process.env.TOKEN_KEY, async (e, _decoded) => {
      if (e) {
        onError({
          auth: false, message: i18n.t('TOKEN.AUTH_FAILED'),
        });
        await client.query('ROLLBACK');
        return;
      }

      await fetchSingleProject(token, projectId, async (project) => {
        if (!project) {
          onError(i18n.t('PROJECT.NOT_FOUND'));
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
      }, (message: string | object | DefaultTFuncReturn) => onError(message));
    });

    client.release();
  } else {
    onError(i18n.t('TOKEN.NOT_FOUND'));
  }
};