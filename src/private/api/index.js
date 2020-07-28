const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const app = require('../singleton/app').getApp();
const knex = require('../singleton/knex').getKnex();

const schema = buildSchema(`
type Post {
  id: Int
  title: String!
  datePublished: String
  description: String
  image: String
  slug: String
  excerpt: String
  type: PostType
  createTime: String
}

enum PostType {
  Epistle
  Reverie
  Poem
  Page
}

input PostInput {
  title: String!
  datePublished: String
  description: String
  image: String
  slug: String
  excerpt: String
  type: PostType
}

type Query {
  getAllPosts(type: PostType): [Post],
  getSinglePost(id: Int!): Post
}

type Mutation {
  createPost(post: PostInput): Post
  updatePost(id: Int!, post: PostInput): Post
}
`);

const root = {
  getAllPosts: ({type}) => {
    let query = knex.select().from('posts');
    if (type) query = query.where('type', type);
    return query.then((posts) => posts);
  },
  getSinglePost: ({ id }) => {
    return knex
      .select()
      .from('posts')
      .where('id', id)
      .then(([post]) => post);
  },
  createPost: ({ post }) => {
    return knex
      .insert(post)
      .into('posts')
      .then(([id]) => {
        return { id };
      });
  },
  updatePost: ({ id, post }) => {
    return knex('posts')
      .update(post)
      .where('id', id)
      .then(([id]) => {
        return { id };
      });
  }
};

app.use(
  '/api',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);
