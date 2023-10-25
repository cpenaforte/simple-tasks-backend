/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/pg';
import { PoolClient } from 'pg';
import { Response } from 'express';
import i18n from 'i18next';
import {
    CreateReceivedUser, DBUser, UpdateReceivedUser, User, UserToSend,
} from '../models/user';
import { parseUserToSend } from '../utils/commonFunctions';


export const fetchUsers = async (
    token: string,
    onSuccess: (message: UserToSend[]) => Response<unknown, Record<string, unknown>> | Promise<void>,
    onError: (message: string) => Response<unknown, Record<string, unknown>> | Promise<void>,
): Promise<void> => {
    if (process.env.TOKEN_KEY) {
        const client: PoolClient = await pool.connect();

        jwt.verify(token, process.env.TOKEN_KEY, async (e, _decoded) => {
            if (e) {
                onError(i18n.t('TOKEN.AUTH_FAILED'));

                return;
            }

            await client.query('BEGIN');

            client.query('SELECT * FROM users ORDER BY email ASC', async (error, results) => {
                if (error) {
                    onError(error.message);

                    await client.query('ROLLBACK');

                    return;
                }

                const parsedUsers = results.rows.map((dbUser: DBUser) => parseUserToSend(dbUser));
                onSuccess(parsedUsers);

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
    onSuccess: (message: UserToSend) => Response<unknown, Record<string, unknown>> | Promise<void>,
    onError: (message: string) => Response<unknown, Record<string, unknown>> | Promise<void>,
): Promise<void> => {
    if (process.env.TOKEN_KEY) {
        const client: PoolClient = await pool.connect();

        jwt.verify(token, process.env.TOKEN_KEY, async (e, _decoded) => {
            if (e) {
                onError(i18n.t('TOKEN.AUTH_FAILED'));

                return;
            }

            await client.query('BEGIN');

            client.query('SELECT * FROM users WHERE user_id = $1', [id], async (error, results) => {
                if (error) {
                    onError(error.message);

                    await client.query('ROLLBACK');

                    return;
                }

                if (!results.rows[0]) {
                    onError(i18n.t('USER.ID_NOT_FOUND'));

                    await client.query('ROLLBACK');

                    return;
                }

                onSuccess(parseUserToSend(results.rows[0]));

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
    onError: (message: string) => Response<unknown, Record<string, unknown>> | Promise<void>,
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
    onSuccess: (message: string) => void,
    onError: (message: string) => void,
): Promise<void> => {
    if (process.env.TOKEN_KEY) {
        const client: PoolClient = await pool.connect();

        const {
            user_password, full_name, email, sex, birthday, confirm_password,
        } = user;

        if (!email || !user_password || !confirm_password) {
            onError(i18n.t('SIGNUP.UNFILLED_FIELDS'));

            return;
        }
        //Confirm Passwords
        if (user_password !== confirm_password) {
            onError(i18n.t('SIGNUP.UNMATCHED_PASSWORDS'));
            return;
        } else {
            //Validation
            fetchUserByEmail(email, async (results: object) => {
                const user = results;

                if (user) {
                    onError(i18n.t('SIGNUP.EMAIL_EXISTS'));

                    return;
                }

                //Password Hashing
                const salt: string = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS || '8'));

                const new_password: string = bcrypt.hashSync(user_password, salt);

                await client.query('BEGIN');

                client.query(
                    'INSERT INTO users (user_password,full_name,email,sex,birthday) VALUES ($1,$2,$3,$4,$5)',
                    [
                        new_password, full_name, email, sex, birthday,
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
    onSuccess: (user: UserToSend) => void,
    onError: (message: string) => void,
): Promise<void> => {
    const client: PoolClient = await pool.connect();

    if (process.env.TOKEN_KEY) {
        jwt.verify(token, process.env.TOKEN_KEY, async (e, _decoded) => {
            if (e) {
                onError(i18n.t('TOKEN.AUTH_FAILED'));

                return;
            }

            const {
                full_name, sex, birthday,
            } = user;

            if (!sex || !birthday) {
                onError(i18n.t('SIGNUP.UNFILLED_FIELDS'));

                return;
            }
            //Validation
            fetchUserById(token, id, async (results: UserToSend) => {
                const dbUser = results;

                if (!dbUser) {
                    onError(i18n.t('USER.ID_NOT_FOUND'));

                    return;
                }

                await client.query('BEGIN');

                //Password Hashing
                client.query(
                    'UPDATE users SET (full_name,sex,birthday) = ($1,$2,$3) WHERE user_id = $4',
                    [
                        full_name, sex, birthday, id,
                    ], async (error, _results) => {
                        if (error) {
                            onError(error.message);

                            await client.query('ROLLBACK');

                            return;
                        }

                        onSuccess({
                            user_id: id, full_name, email: dbUser.email, sex, birthday,
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
    onError: (message: string) => void,
): Promise<void> => {
    const client: PoolClient = await pool.connect();

    if (process.env.TOKEN_KEY) {
        jwt.verify(token, process.env.TOKEN_KEY, async (e, _decoded) => {
            if (e) {
                onError(i18n.t('TOKEN.AUTH_FAILED'));

                return;
            }

            await client.query('BEGIN');

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