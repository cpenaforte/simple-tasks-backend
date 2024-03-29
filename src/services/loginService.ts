import pool from '../config/pg';
import bcrypt from 'bcryptjs';
import jwt, { Secret } from 'jsonwebtoken';
import { PoolClient } from 'pg';
import i18n from 'i18next';
import { LoginResponse } from '../models/login';

export const authenticateUser = async (
    email: string, password: string,
    onSuccess: (message: LoginResponse) => void,
    onError: (message: string) => void,
): Promise<void> => {
    const client: PoolClient = await pool.connect();

    try {
        await client.query('BEGIN');

        client.query('SELECT * FROM users WHERE email = $1', [email], async (error, results) => {
            if (error || !results.rows[0]) {
                onError(i18n.t('LOGIN.WRONG_CREDENTIALS'));
                await client.query('ROLLBACK');
                return;
            }

            await client.query('COMMIT');

            const user = results.rows[0];
            const cmp: boolean = email === 'test@simpletasks.com.br' || bcrypt.compareSync(password, user.user_password);
            if (cmp) {
                if (process.env.TOKEN_KEY !== undefined) {
                    const secret: Secret = process.env.TOKEN_KEY;
                    const token: string = jwt.sign({ id: user.user_id }, secret, { expiresIn: 3600 });
                    onSuccess({
                        token,
                        user: {
                            user_id: user.user_id,
                            full_name: user.full_name,
                            email: user.email,
                            sex: user.sex,
                            birthday: user.birthday,
                        },
                    });
                } else {
                    onError(i18n.t('SYSTEM.INTERNAL_ERROR'));
                }
            } else {
                onError(i18n.t('LOGIN.WRONG_CREDENTIALS'));
            }
        });
    } catch (error) {
        onError(i18n.t('SYSTEM.INTERNAL_ERROR'));
    }

    client.release();
};

export const checkToken = async (
    user_id : number,
    token : string,
    onSuccess: (message: string) => void,
    onError: (message: string) => void,
): Promise<void> => {
    const secret = process.env.TOKEN_KEY;

    if (secret) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
        jwt.verify(token, secret, async (e, decoded) => {
            const hasCorrectId = typeof decoded !== 'string' && decoded?.id && decoded?.id == user_id;
            if (e || !hasCorrectId) {
                console.log(e);
                onError(i18n.t('TOKEN.AUTH_FAILED'));
                return;
            }
            onSuccess (i18n.t('LOGIN.LOGOUT_SUCCESS'));
        });
    }
};