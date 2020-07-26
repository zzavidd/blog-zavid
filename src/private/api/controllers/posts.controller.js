const knex = require('../../singleton/knex').getKnex();

exports.getAllPosts = (req, res) => {
  const query = knex.select().from('posts').where('type', 'reverie');
  query.asCallback(function (err, reveries) {
    res.status(200).json(reveries);
  });
};