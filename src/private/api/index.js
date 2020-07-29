const { graphqlHTTP } = require('express-graphql');
const fs = require('fs');
const path = require('path');
const { buildSchema } = require('graphql');
const app = require('../singleton/app').getApp();

const resolvers = require('./resolvers');
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
