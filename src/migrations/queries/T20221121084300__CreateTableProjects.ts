import { PoolClient } from 'pg';

module.exports = async (client: PoolClient): Promise<void> => {
  await client.query('CREATE TABLE IF NOT EXISTS projects (project_id serial primary key, user_id int4 not null, name varchar(50) not null, description varchar(255), CONSTRAINT fk_users FOREIGN KEY(user_id) REFERENCES users(user_id))')
    .catch((error) => {
      if (error) {
        console.log(error.message);
        throw new Error(error);
      }
    });
};