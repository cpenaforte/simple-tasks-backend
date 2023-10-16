/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/pg';
import { PoolClient } from 'pg';
import { Response } from 'express';
import i18n from 'i18next';
import {
  CreateReceivedUser, UpdateReceivedUser, User,
} from '../models/user';


export const fetchUsers = async (
  token: string,
  onSuccess: (message: User[]) => Response<unknown, Record<string, unknown>> | Promise<void>,
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

      client.query('SELECT * FROM users ORDER BY username ASC', async (error, results) => {
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

export const fetchUserById = async (
  token: string,
  id: number,
  onSuccess: (message: User) => Response<unknown, Record<string, unknown>> | Promise<void>,
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
      client.query('SELECT * FROM users WHERE user_id = $1', [id], async (error, results) => {
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

export const fetchUserByUsername = async (
  token: string,
  username: string,
  onSuccess: (message: User) => Response<unknown, Record<string, unknown>> | Promise<void>,
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

      client.query('SELECT * FROM users WHERE username = $1', [username], async (error, results) => {
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

export const fetchUserByEmail = async (
  email: string,
  onSuccess: (message: User) => Response<unknown, Record<string, unknown>> | Promise<void>,
  onError: (message: string | object) => Response<unknown, Record<string, unknown>> | Promise<void>,
): Promise<void> => {
  if (process.env.TOKEN_KEY) {
    const client: PoolClient = await pool.connect();
    await client.query('BEGIN');

    client.query('SELECT * FROM users WHERE email = $1', [email], async (error, results) => {
      if (error) {
        onError(error.message);
        await client.query('ROLLBACK');
        return;
      }

      onSuccess(results.rows[0]);
      await client.query('COMMIT');
    });
    client.release();
  } else {
    onError(i18n.t('TOKEN.NOT_FOUND'));
  }
};

export const insertUser = async (
  user: CreateReceivedUser,
  onSuccess: (message: string | object) => void,
  onError: (message: string | object) => void,
): Promise<void> => {
  if (process.env.TOKEN_KEY) {
    const client: PoolClient = await pool.connect();
    await client.query('BEGIN');

    const {
      username, user_password, full_name, email, sex, birthday, confirm_password,
    } = user;

    if (!username || !email || !user_password || !confirm_password) {
      onError(i18n.t('SIGNUP.UNFILLED_FIELDS'));
      await client.query('ROLLBACK');
      return;
    }
    //Confirm Passwords
    if (user_password !== confirm_password) {
      onError(i18n.t('SIGNUP.UNMATCHED_PASSWORDS'));
      await client.query('ROLLBACK');
      return;
    } else {
      //Validation
      fetchUserByEmail(email, async (results: object) => {
        const user = results;

        if (user) {
          onError(i18n.t('SIGNUP.EMAIL_EXISTS'));
          await client.query('ROLLBACK');
          return;
        }

        //Password Hashing
        const salt: string = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS || '8'));

        const new_password: string = bcrypt.hashSync(user_password, salt);

        client.query(
          'INSERT INTO users (username,user_password,full_name,email,sex,birthday) VALUES ($1,$2,$3,$4,$5,$6)',
          [
            username, new_password, full_name, email, sex, birthday,
          ], async (error, _results) => {
            if (error) {
              onError(error.message);
              await client.query('ROLLBACK');
              return;
            }
            onSuccess(i18n.t('SIGNUP.REGISTERED_SUCCESSFULLY'));
            await client.query('COMMIT');
          });
      }, async (error) => {
        onError(error);
        await client.query('ROLLBACK');
      });
    }
    client.release();
  } else {
    onError(i18n.t('TOKEN.NOT_FOUND'));
  }
};

export const patchUser = async (
  token: string,
  id: number,
  user: UpdateReceivedUser,
  onSuccess: (user: object) => void,
  onError: (message: string | object) => void,
): Promise<void> => {
  const client: PoolClient = await pool.connect();
  await client.query('BEGIN');
  if (process.env.TOKEN_KEY) {
    jwt.verify(token, process.env.TOKEN_KEY, async (e, _decoded) => {
      if (e) {
        onError({
          auth: false, message: i18n.t('TOKEN.AUTH_FAILED'),
        });
        await client.query('ROLLBACK');
        return;
      }

      const {
        username, full_name, email, sex, birthday,
      } = user;

      if (!username || !email || !sex || !birthday) {
        onError(i18n.t('SIGNUP.UNFILLED_FIELDS'));
        await client.query('ROLLBACK');
        return;
      }
      //Validation
      fetchUserById(token, id, async (results: string | object) => {
        const user = results;

        if (!user) {
          console.log(user);
          onError(i18n.t('USER.ID_NOT_FOUND'));
          await client.query('ROLLBACK');
          return;
        }

        //Password Hashing
        client.query(
          'UPDATE users SET (username,full_name,email,sex,birthday) = ($1,$2,$3,$4,$5) WHERE user_id = $6',
          [
            username, full_name, email, sex, birthday, id,
          ], async (error, _results) => {
            if (error) {
              onError(error.message);
              await client.query('ROLLBACK');
              return;
            }
            onSuccess({
              user_id: id, username, full_name, email, sex, birthday,
            });
            await client.query('COMMIT');
          });
      }, async (error) => {
        onError(error);
        await client.query('ROLLBACK');
      });
    });
    client.release();
  } else {
    onError(i18n.t('TOKEN.NOT_FOUND'));
  }
};

export const removeUserById = async (
  token: string,
  id: number,
  onSuccess: (message: string) => void,
  onError: (message: string | object) => void,
): Promise<void> => {
  const client: PoolClient = await pool.connect();
  await client.query('BEGIN');
  if (process.env.TOKEN_KEY) {
    jwt.verify(token, process.env.TOKEN_KEY, async (e, _decoded) => {
      if (e) {
        onError({
          auth: false, message: i18n.t('TOKEN.AUTH_FAILED'),
        });
        await client.query('ROLLBACK');
        return;
      }

      client.query('DELETE FROM users WHERE user_id = $1', [id], async (error, _results) => {
        if (error) {
          onError(error.message);
          await client.query('ROLLBACK');
          return;
        }

        onSuccess('ok');
        await client.query('COMMIT');
      });
    });
    client.release();
  } else {
    onError(i18n.t('TOKEN.NOT_FOUND'));
  }
};