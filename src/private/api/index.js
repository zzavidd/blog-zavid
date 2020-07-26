const postsEndpoint = require('./endpoints/posts.endpoint');

const app = require('../singleton/app').getApp();

// Articles routes
app.use('/api/v1/posts', postsEndpoint);