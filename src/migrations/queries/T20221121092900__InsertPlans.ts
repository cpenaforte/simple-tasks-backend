/* eslint-disable quotes */
import { PoolClient } from 'pg';

module.exports = async (client: PoolClient): Promise<void> => {
  await client.query("INSERT INTO plans (plan_title, task_permission, share_permission, cowork_permission, tasks_limit, shares_limit) values ('Basic',1,0,0,200,5) ON CONFLICT DO NOTHING")
    .catch((error) => {
      if (error) {
        console.log(error.message);
        throw new Error(error);
      }
    });
  await client.query("INSERT INTO plans (plan_title, task_permission, share_permission, cowork_permission, tasks_limit, shares_limit) values ('Intermediate',1,1,0,500,50) ON CONFLICT DO NOTHING")
    .catch((error) => {
      if (error) {
        console.log(error.message);
        throw new Error(error);
      }
    });
  await client.query("INSERT INTO plans (plan_title, task_permission, share_permission, cowork_permission) values ('Professional',1,1,1) ON CONFLICT DO NOTHING")
    .catch((error) => {
      if (error) {
        console.log(error.message);
        throw new Error(error);
      }
    });
};