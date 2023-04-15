/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import jwt from 'jsonwebtoken';
import pool from '../config/pg';
import { PoolClient } from 'pg';
import { Response } from 'express';
import i18n, { DefaultTFuncReturn } from 'i18next';


export const fetchPlans = async (
  token: string,
  onSuccess: (message: object) => Response<unknown, Record<string, unknown>> | Promise<void>,
  onError: (message: string | object) => Response<unknown, Record<string, unknown>> | Promise<void>,
): Promise<void> => {
  if (process.env.TOKEN_KEY) {
    const client: PoolClient = await pool.connect();
    await client.query('BEGIN');
    jwt.verify(token, process.env.TOKEN_KEY, async (e, decoded) => {
      if (e) {
        onError({
          auth: false, message: i18n.t('TOKEN.AUTH_FAILED'),
        });
        await client.query('ROLLBACK');
        return;
      }

      client.query('SELECT * FROM plans ORDER BY plan_title ASC', async (error, results) => {
        if (error) {
          onError(error.message);
          await client.query('ROLLBACK');
          return;
        }

        onSuccess(results.rows.map((user) => ({
          id: user.user_id,
          name: user.full_name,
          username: user.username,
          email: user.email,
          sex: user.sex,
          birthday: user.birthday,
        })));
        await client.query('COMMIT');
      });
    });
    client.release();
  }
};

export const fetchPlanByTitle = async (
  token: string,
  planTitle: string,
  onSuccess: (message: object) => Response<unknown, Record<string, unknown>> | Promise<void>,
  onError: (message: string | object) => Response<unknown, Record<string, unknown>> | Promise<void>,
): Promise<void> => {
  if (process.env.TOKEN_KEY) {
    const client: PoolClient = await pool.connect();
    await client.query('BEGIN');
    jwt.verify(token, process.env.TOKEN_KEY, async (e, decoded) => {
      if (e) {
        onError({
          auth: false, message: i18n.t('TOKEN.AUTH_FAILED'),
        });
        await client.query('ROLLBACK');
        return;
      }
      client.query('SELECT * FROM plans WHERE plan_title = $1', [planTitle], async (error, results) => {
        if (error) {
          onError(error.message);
          await client.query('ROLLBACK');
          return;
        }

        const user = results.rows[0];

        onSuccess({
          id: user.user_id,
          name: user.full_name,
          username: user.username,
          email: user.email,
          sex: user.sex,
          birthday: user.birthday,
        });

        await client.query('COMMIT');
      });
    });
    client.release();
  }
};

export const fetchUserPlanByUserId = async (
  token: string,
  userId: number,
  onSuccess: (message: object) => Response<unknown, Record<string, unknown>> | Promise<void>,
  onError: (message: string | object) => Response<unknown, Record<string, unknown>> | Promise<void>,
): Promise<void> => {
  if (process.env.TOKEN_KEY) {
    const client: PoolClient = await pool.connect();
    await client.query('BEGIN');
    jwt.verify(token, process.env.TOKEN_KEY, async (e, decoded) => {
      if (e) {
        onError({
          auth: false, message: i18n.t('TOKEN.AUTH_FAILED'),
        });
        await client.query('ROLLBACK');
        return;
      }
      client.query('SELECT * FROM user_plans WHERE user_id = $1', [userId], async (error, results) => {
        if (error) {
          onError(error.message);
          await client.query('ROLLBACK');
          return;
        }

        const user = results.rows[0];

        onSuccess({
          id: user.user_id,
          name: user.full_name,
          username: user.username,
          email: user.email,
          sex: user.sex,
          birthday: user.birthday,
        });

        await client.query('COMMIT');
      });
    });
    client.release();
  }
};

export const insertUserPlan = async (
  token: string,
  plan: { planId: number, userId: number, startDate: Date, endDate: Date | null},
  onSuccess: (message: DefaultTFuncReturn) => Response<unknown, Record<string, unknown>> | Promise<void>,
  onError: (message: string | object | DefaultTFuncReturn) => Response<unknown, Record<string, unknown>> | Promise<void>,
): Promise<void> => {
  if (process.env.TOKEN_KEY) {
    const client: PoolClient = await pool.connect();
    await client.query('BEGIN');
    jwt.verify(token, process.env.TOKEN_KEY, async (e, decoded) => {
      if (e) {
        onError({
          auth: false, message: i18n.t('TOKEN.AUTH_FAILED'),
        });
        await client.query('ROLLBACK');
        return;
      }

      const {
        planId, userId, startDate, endDate,
      } = plan;

      fetchUserPlanByUserId(token, userId, async (userPlan) => {
        if (userPlan) {
          onError(i18n.t('PLAN.ALREADY_HAVE_PLAN'));
          await client.query('ROLLBACK');
          return;
        }

        client.query('INSERT INTO user_plans (plan_id, user_id, start_date, end_Date) values ($1,$2,$3,$4,$5)', [
          planId, userId, startDate, endDate,
        ], async (error, results) => {
          if (error) {
            onError(error.message);
            await client.query('ROLLBACK');
            return;
          }

          onSuccess(i18n.t('PLAN.REGISTERED'));
          await client.query('COMMIT');
        });
      }, (message: string | object) => onError(message));
    });
    client.release();
  }
};

export const patchUserPlan = async (
  token: string,
  plan: { planId: number, userId: number, startDate: Date, endDate: Date | null},
  onSuccess: (message: DefaultTFuncReturn) => Response<unknown, Record<string, unknown>> | Promise<void>,
  onError: (message: string | object | DefaultTFuncReturn) => Response<unknown, Record<string, unknown>> | Promise<void>,
): Promise<void> => {
  if (process.env.TOKEN_KEY) {
    const client: PoolClient = await pool.connect();
    await client.query('BEGIN');
    jwt.verify(token, process.env.TOKEN_KEY, async (e, decoded) => {
      if (e) {
        onError({
          auth: false, message: i18n.t('TOKEN.AUTH_FAILED'),
        });
        await client.query('ROLLBACK');
        return;
      }

      const {
        planId, userId, startDate, endDate,
      } = plan;

      fetchUserPlanByUserId(token, userId, async (userPlan) => {
        if (!userPlan) {
          onError(i18n.t('PLAN.NO_ACTIVE_PLAN'));
          await client.query('ROLLBACK');
          return;
        }

        client.query('UPDATE user_plans SET (plan_id, user_id, start_date, end_Date) = ($1,$2,$3,$4,$5) WHERE user_id = $6', [
          planId, userId, startDate, endDate, userId,
        ], async (error, results) => {
          if (error) {
            onError(error.message);
            await client.query('ROLLBACK');
            return;
          }

          onSuccess(i18n.t('PLAN.UPDATED'));
          await client.query('COMMIT');
        });
      }, (message: string | object) => onError(message));
    });
    client.release();
  }
};

export const deactivateUserPlan = async (
  token: string,
  userId: number,
  onSuccess: (message: DefaultTFuncReturn) => Response<unknown, Record<string, unknown>> | Promise<void>,
  onError: (message: string | object | DefaultTFuncReturn) => Response<unknown, Record<string, unknown>> | Promise<void>,
): Promise<void> => {
  if (process.env.TOKEN_KEY) {
    const client: PoolClient = await pool.connect();
    await client.query('BEGIN');
    jwt.verify(token, process.env.TOKEN_KEY, async (e, decoded) => {
      if (e) {
        onError({
          auth: false, message: i18n.t('TOKEN.AUTH_FAILED'),
        });
        await client.query('ROLLBACK');
        return;
      }

      fetchUserPlanByUserId(token, userId, async (userPlan) => {
        if (!userPlan) {
          onError(i18n.t('PLAN.NO_ACTIVE_PLAN'));
          await client.query('ROLLBACK');
          return;
        }

        client.query('UPDATE user_plans SET plan_id = 1 WHERE user_id = $1', [userId], async (error, results) => {
          if (error) {
            onError(error.message);
            await client.query('ROLLBACK');
            return;
          }

          onSuccess(i18n.t('PLAN.DEACTIVATED'));
          await client.query('COMMIT');
        });
      }, (message: string | object) => onError(message));
    });
    client.release();
  }
};