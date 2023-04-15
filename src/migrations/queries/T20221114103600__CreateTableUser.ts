import { PoolClient } from 'pg';

module.exports = async (client: PoolClient): Promise<void> => {
  await client.query('CREATE TABLE IF NOT EXISTS users (user_id serial primary key, username varchar(20) unique not null, user_password varchar(100) not null, full_name varchar(500) not null, email varchar(500) unique not null, sex varchar(15) not null, birthday timestamp)')
    .catch((error) => {
      if (error) {
        console.log(error.message);
        throw new Error(error);
      }
    });
};