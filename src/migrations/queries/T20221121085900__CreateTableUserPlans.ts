import { PoolClient } from 'pg';

module.exports = async (client: PoolClient): Promise<void> => {
  await client.query('CREATE TABLE IF NOT EXISTS user_plans (plan_id int4 not null REFERENCES plans(plan_id), user_id int4 unique not null REFERENCES users(user_id), start_date timestamp not null, end_date timestamp)')
    .catch((error) => {
      if (error) {
        console.log(error.message);
        throw new Error(error);
      }
    });
};