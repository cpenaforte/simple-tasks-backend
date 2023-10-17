/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import jwt from 'jsonwebtoken';
import pool from '../config/pg';
import { PoolClient } from 'pg';
import { Response } from 'express';
import i18n from 'i18next';
import {
  ReceivedTask, TaskToSend,
} from '../models/task';

export const fetchUserTasks = async (
  token: string,
  userId: number,
  onSuccess: (message: TaskToSend[]) => Response<unknown, Record<string, unknown>> | Promise<void>,
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
        'SELECT * FROM tasks WHERE user_id = $1 ORDER BY creation_date DESC',
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

export const fetchSingleTask = async (
  token: string,
  userId: number,
  taskId: number,
  onSuccess: (message: TaskToSend) => Response<unknown, Record<string, unknown>> | Promise<void>,
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
        'SELECT * FROM tasks WHERE task_id = $1 AND user_id = $2 ORDER BY creation_date DESC',
        [ taskId, userId ],
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

export const insertTask = async (
  token: string,
  task: ReceivedTask,
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

      const {
        user_id, project_id, task_title, task_description, creation_date, due_date, urgency, done,
      } = task;

      client.query('INSERT INTO tasks (user_id, project_id, task_title, task_description, creation_date, due_date, urgency, done) values ($1,$2,$3,$4,$5,$6,$7,$8)', [
        user_id, project_id, task_title, task_description, creation_date, due_date, urgency, done,
      ], async (error, _results) => {
        if (error) {
          onError(error.message);
          await client.query('ROLLBACK');
          return;
        }

        onSuccess(i18n.t('TASK.REGISTERED'));
        await client.query('COMMIT');
      });
    });
    client.release();
  } else {
    onError(i18n.t('TOKEN.NOT_FOUND'));
  }
};

export const patchTask = async (
  token: string,
  userId: number,
  taskId: number,
  task: ReceivedTask,
  onSuccess: (task: TaskToSend) => Response<unknown, Record<string, unknown>> | Promise<void>,
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
        user_id, project_id, task_title, task_description, creation_date, due_date, urgency, done,
      } = task;

      await fetchSingleTask(token, userId, taskId, async (task) => {
        if (!task) {
          onError(i18n.t('TASK.NOT_FOUND'));
          await client.query('ROLLBACK');
          return;
        }

        if (task.user_id !== userId) {
          onError(i18n.t('TASK.NOT_FOUND'));
          await client.query('ROLLBACK');
          return;
        }

        client.query('UPDATE tasks SET (user_id, project_id, task_title, task_description, creation_date, due_date, urgency, done) = ($1,$2,$3,$4,$5,$6,$7,$8) WHERE task_id = $7', [
          user_id, project_id, task_title, task_description, creation_date, due_date, urgency, done,
        ], async (error, _results) => {
          if (error) {
            onError(error.message);
            await client.query('ROLLBACK');
            return;
          }

          onSuccess({
            ...task,
            task_id: taskId,
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

export const removeTask = async (
  token: string,
  userId: number,
  taskId: number,
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

      await fetchSingleTask(token, userId, taskId, async (task) => {
        if (!task) {
          onError(i18n.t('TASK.NOT_FOUND'));
          await client.query('ROLLBACK');
          return;
        }

        if (task.user_id !== userId) {
          onError(i18n.t('TASK.NOT_FOUND'));
          await client.query('ROLLBACK');
          return;
        }

        await client.query('DELETE FROM tasks WHERE task_id = $1', [taskId])
          .catch(async (error) => {
            onError(error.message);
            await client.query('ROLLBACK');
            return;
          });

        await client.query('DELETE FROM shared_tasks WHERE task_id = $1', [taskId])
          .catch(async (error) => {
            onError(error.message);
            await client.query('ROLLBACK');
            return;
          });

        onSuccess(i18n.t('TASK.DELETED'));
        await client.query('COMMIT');
      }, (message: string) => onError(message));
    });

    client.release();
  } else {
    onError(i18n.t('TOKEN.NOT_FOUND'));
  }
};