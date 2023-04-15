import { PoolClient } from 'pg';

module.exports = async (client: PoolClient): Promise<void> => {
  await client.query('CREATE TABLE IF NOT EXISTS tasks (task_id serial primary key, user_id int4 not null, task_title varchar(50) not null, task_description varchar(255), creation_date timestamp not null, due_date timestamp, urgency varchar(15) not null, done integer not null, CONSTRAINT fk_users FOREIGN KEY(user_id) REFERENCES users(user_id))')
    .catch((error) => {
      if (error) {
        console.log(error.message);
        throw new Error(error);
      }
    });
};