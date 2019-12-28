

module.exports = (app, conn) => {
  /**
   * Retrieve posts.
   * @api {GET} /posts
   * @param {int} limit - The number of posts to retrieve.
   * @param {string} order - The order to sort the posts. Either ASC or DESC.
   */
  app.get('/api/posts', function(req, res){
    const limit = parseInt(req.query.limit);
    const order = req.query.order;

    let sql = `SELECT * FROM posts WHERE type != 'page'`;
    if (order) sql += ` ORDER BY date ${order}`;
    if (limit) sql += ` LIMIT ${limit}`;

    conn.query(sql, function (err, result) {
      if (err) return console.error(err);
      res.json(result);
    });
  });

  /**
   * Retrieve only reveries.
   * @api {GET} /posts/reveries
   */
  app.get('/api/posts/reveries', function(req, res){
    conn.query("SELECT * FROM posts WHERE type = 'reverie'", function (err, result) {
      if (err) return console.error(err);
      res.json(result);
    });
  });
}