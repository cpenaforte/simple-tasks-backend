import { PoolClient } from 'pg';

/* eslint-disable no-unused-vars */
module.exports = async (client: PoolClient): Promise<void> => {
  await client.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT FALSE')
    .catch((error) => {
      if (error) {
        console.log(error.message);
        throw new Error(error);
      }
    });
};