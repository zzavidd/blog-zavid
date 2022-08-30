import Knex from 'knex';

export const knex = Knex({
  client: 'mysql',
  connection: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PWD,
    database: process.env.MYSQL_NAME,
    charset: 'utf8mb4',
  },
});
