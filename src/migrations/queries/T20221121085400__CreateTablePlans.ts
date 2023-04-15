import { PoolClient } from 'pg';

module.exports = async (client: PoolClient): Promise<void> => {
  await client.query('CREATE TABLE IF NOT EXISTS plans (plan_id serial primary key, plan_title varchar(20) unique not null, task_permission integer not null, share_permission integer not null, cowork_permission integer not null, tasks_limit int4, shares_limit int4)')
    .catch((error) => {
      if (error) {
        console.log(error.message);
        throw new Error(error);
      }
    });
};