import { PoolClient } from 'pg';

/* eslint-disable no-unused-vars */
module.exports = async (client: PoolClient): Promise<void> => {
  await client.query('ALTER TABLE migrations ADD COLUMN IF NOT EXISTS last_modified TIMESTAMP NOT NULL')
    .catch((error) => {
      if (error) {
        console.log(error.message);
        throw new Error(error);
      }
    });
};