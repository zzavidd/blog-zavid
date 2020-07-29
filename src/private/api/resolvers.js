const knex = require('../singleton/knex').getKnex();

exports.getAllPosts = ({ limit, random = false, type }) => {
  let query = knex.select().from('posts');
  if (type) query = query.where('type', type);
  if (random) query = query.orderByRaw('RAND()');
  if (limit) query = query.limit(limit);
  return query.then((posts) => posts);
};

exports.getSinglePost = ({ id }) => {
  return knex
    .select()
    .from('posts')
    .where('id', id)
    .then(([post]) => post)
    .catch((err) => console.log(err));
};

exports.createPost = ({ post }) => {
  return knex
    .insert(post)
    .into('posts')
    .then(([id]) => ({id}));
};

exports.updatePost = ({ id, post }) => {
  return knex('posts')
    .update(post)
    .where('id', id)
    .then(() => resolvers.getSinglePost({id}))
    .catch((err) => console.log(err));
};

exports.deletePost = ({ id }) => {
  return knex('posts').where('id', id).del();
};