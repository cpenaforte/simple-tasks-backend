import { PoolClient } from 'pg';

/* eslint-disable no-unused-vars */
module.exports = async (client: PoolClient): Promise<void> => {
  await client.query('INSERT INTO users(user_password,full_name,email,sex,birthday) VALUES (\'123456\',\'Teste\',\'test@simpletasks.com.br\',\'male\',\'1999-08-26\')')
    .catch((error) => {
      if (error) {
        console.log(error.message);
        throw new Error(error);
      }
    });
};
