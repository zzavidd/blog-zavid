import Knex from 'knex';

// if (!process.env.PORT) {
//   throw new Error(`No environment variables loaded.`);
// }

let database = process.env.MYSQL_NAME!;
if (process.env.NODE_ENV !== 'production' && !process.env.CI) {
  database += 'test';
}

export const knex = Knex({
  client: 'mysql',
  connection: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PWD,
    database,
    charset: 'utf8mb4',
  },
});
