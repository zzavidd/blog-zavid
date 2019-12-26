

module.exports = (app, conn) => {
  /**
   * Home page
   * @route {GET} /home
   */
  app.get('/api/reveries/all', function(req, res){
    conn.query("SELECT * FROM posts WHERE type = 'reverie'", function (err, result) {
      if (err) return console.error(err);
      res.json(result);
    });
  });
}