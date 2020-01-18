

module.exports = (app, conn) => {
  /**
   * Retrieve posts.
   * @api {GET} /api/posts
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
   * @api {GET} /api/posts/reveries
   */
  app.get('/api/posts/reveries', function(req, res){
    conn.query("SELECT * FROM posts WHERE type = 'reverie'", function (err, result) {
      if (err) return console.error(err);
      res.json(result);
    });
  });

  /**
   * Retrieve only reveries.
   * @api {POST} /api/posts/add
   */
  app.post('/api/posts/add', function(req, res){
    let {session, changed} = req.body;

    async.waterfall([
      function(callback){
        filer.uploadImage(session, 'sessions', changed, callback);
      },
      function(entity, callback){ // Add session to database
        session = entity;
        const sql = "INSERT INTO sessions (title, dateHeld, image, slug, description) VALUES ?";
        const values = [[session.title, session.dateHeld, session.image, session.slug, session.description]];
        
        conn.query(sql, [values], function (err, result) {
          err ? callback(err) : callback(null, result.insertId);
        });
      }
    ], function(err, id){
      resToClient(res, err, {id, ...session});
    });
  });
}