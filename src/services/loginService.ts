import pool from '../config/pg';
import bcrypt from 'bcryptjs';
import jwt, { Secret } from 'jsonwebtoken';
import { PoolClient } from 'pg';
import i18n from 'i18next';

export const authenticateUser = async (
  email: string, password: string,
  onSuccess: (message: object) => void,
  onError: (message: string) => void,
): Promise<void> => {
  const client: PoolClient = await pool.connect();
  await client.query('BEGIN');
  try {
    client.query('SELECT * FROM users WHERE email = $1', [email], async (error, results) => {
      if (error || !results.rows[0]) {
        onError(i18n.t('LOGIN.WRONG_CREDENTIALS'));
        await client.query('ROLLBACK');
        return;
      }

      const user = results.rows[0];
      const cmp: boolean = bcrypt.compareSync(password, user.user_password);
      if (cmp) {
        if (process.env.TOKEN_KEY !== undefined) {
          const secret: Secret = process.env.TOKEN_KEY;
          const token: string = jwt.sign({ id: user.user_id }, secret, { expiresIn: 3600 });
          onSuccess({
            token,
            user: {
              id: user.user_id,
              name: user.full_name,
              username: user.username,
              email: user.email,
              sex: user.sex,
              birthday: user.birthday,
            },
          });
          await client.query('COMMIT');
        } else {
          onError(i18n.t('SYSTEM.INTERNAL_ERROR'));
          await client.query('ROLLBACK');
        }
      } else {
        onError(i18n.t('LOGIN.WRONG_CREDENTIALS'));
        await client.query('ROLLBACK');
      }
    });
  } catch (error) {
    onError(i18n.t('SYSTEM.INTERNAL_ERROR'));
    await client.query('ROLLBACK');
  }

  client.release();
};