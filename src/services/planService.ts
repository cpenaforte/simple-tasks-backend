/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import jwt from 'jsonwebtoken';
import pool from '../config/pg';
import { PoolClient } from 'pg';
import { Response } from 'express';
import i18n from 'i18next';
import {
  Plan, UserPlan,
} from '../models/plan';


export const fetchPlans = async (
  token: string,
  onSuccess: (message: Plan[]) => Response<unknown, Record<string, unknown>> | Promise<void>,
  onError: (message: string | object) => Response<unknown, Record<string, unknown>> | Promise<void>,
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

      client.query('SELECT * FROM plans ORDER BY plan_title ASC', async (error, results) => {
        if (error) {
          onError(error.message);
          await client.query('ROLLBACK');
          return;
        }

        const plans: Plan[] = results.rows;

        onSuccess(plans);
        await client.query('COMMIT');
      });
    });
    client.release();
  } else {
    onError(i18n.t('TOKEN.NOT_FOUND'));
  }
};

export const fetchPlanByTitle = async (
  token: string,
  planTitle: string,
  onSuccess: (message: Plan) => Response<unknown, Record<string, unknown>> | Promise<void>,
  onError: (message: string | object) => Response<unknown, Record<string, unknown>> | Promise<void>,
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
      client.query('SELECT * FROM plans WHERE plan_title = $1', [planTitle], async (error, results) => {
        if (error) {
          onError(error.message);
          await client.query('ROLLBACK');
          return;
        }

        if (results.rows.length === 0) {
          onError(i18n.t('PLAN.NOT_FOUND'));
          await client.query('ROLLBACK');
          return;
        }

        const plan: Plan = results.rows[0];

        onSuccess(plan);

        await client.query('COMMIT');
      });
    });
    client.release();
  } else {
    onError(i18n.t('TOKEN.NOT_FOUND'));
  }
};

export const fetchUserPlanByUserId = async (
  token: string,
  user_id: number,
  onSuccess: (message?: UserPlan) => Response<unknown, Record<string, unknown>> | Promise<void>,
  onError: (message: string | object) => Response<unknown, Record<string, unknown>> | Promise<void>,
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
      client.query('SELECT * FROM user_plans WHERE user_id = $1', [user_id], async (error, results) => {
        if (error) {
          onError(error.message);
          await client.query('ROLLBACK');
          return;
        }

        const userPlan: UserPlan | undefined = results.rows[0];

        onSuccess(userPlan);

        await client.query('COMMIT');
      });
    });
    client.release();
  } else {
    onError(i18n.t('TOKEN.NOT_FOUND'));
  }
};

export const insertUserPlan = async (
  token: string,
  plan: UserPlan,
  onSuccess: (message: string) => Response<unknown, Record<string, unknown>> | Promise<void>,
  onError: (message: string | object) => Response<unknown, Record<string, unknown>> | Promise<void>,
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
        plan_id, user_id, start_date, end_date,
      } = plan;

      fetchUserPlanByUserId(token, user_id, async (userPlan) => {
        if (userPlan) {
          onError(i18n.t('PLAN.ALREADY_HAVE_PLAN'));
          await client.query('ROLLBACK');
          return;
        }

        client.query('INSERT INTO user_plans (plan_id, user_id, start_date, end_Date) values ($1,$2,$3,$4)', [
          plan_id, user_id, start_date, end_date,
        ], async (error, _results) => {
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
  } else {
    onError(i18n.t('TOKEN.NOT_FOUND'));
  }
};

export const patchUserPlan = async (
  token: string,
  plan: UserPlan,
  onSuccess: (message: string) => Response<unknown, Record<string, unknown>> | Promise<void>,
  onError: (message: string | object) => Response<unknown, Record<string, unknown>> | Promise<void>,
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
        plan_id, user_id, start_date, end_date,
      } = plan;

      fetchUserPlanByUserId(token, user_id, async (userPlan) => {
        if (!userPlan) {
          onError(i18n.t('PLAN.NO_ACTIVE_PLAN'));
          await client.query('ROLLBACK');
          return;
        }

        client.query('UPDATE user_plans SET (plan_id, user_id, start_date, end_Date) = ($1,$2,$3,$4,$5) WHERE user_id = $6', [
          plan_id, user_id, start_date, end_date, user_id,
        ], async (error, _results) => {
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
  } else {
    onError(i18n.t('TOKEN.NOT_FOUND'));
  }
};

export const deactivateUserPlan = async (
  token: string,
  user_id: number,
  onSuccess: (message: string) => Response<unknown, Record<string, unknown>> | Promise<void>,
  onError: (message: string | object) => Response<unknown, Record<string, unknown>> | Promise<void>,
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

      fetchUserPlanByUserId(token, user_id, async (userPlan) => {
        if (!userPlan) {
          onError(i18n.t('PLAN.NO_ACTIVE_PLAN'));
          await client.query('ROLLBACK');
          return;
        }

        client.query('UPDATE user_plans SET plan_id = 1 WHERE user_id = $1', [user_id], async (error, _results) => {
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
  } else {
    onError(i18n.t('TOKEN.NOT_FOUND'));
  }
};