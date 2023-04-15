import { PoolClient } from 'pg';

module.exports = async (client: PoolClient): Promise<void> => {
  await client.query('CREATE TABLE IF NOT EXISTS shared_tasks (shared_task_id serial primary key, task_id int4 not null, user_id int4 not null, cowork integer not null, CONSTRAINT fk_task FOREIGN KEY(task_id) REFERENCES tasks(task_id), CONSTRAINT fk_users FOREIGN KEY(user_id) REFERENCES users(user_id))')
    .catch((error) => {
      if (error) {
        console.log(error.message);
        throw new Error(error);
      }
    });
};