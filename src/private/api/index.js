const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const fs = require('fs');
const path = require('path');

const resolvers = require('./resolvers');

const app = require('../singleton').getApp();

const typeDefs = fs.readFileSync(path.join(__dirname, 'schema.gql'), 'utf-8');
const schema = buildSchema(typeDefs);

app.use(
  '/api',
  graphqlHTTP({
    schema,
    rootValue: resolvers,
    graphiql: true
  })
);
