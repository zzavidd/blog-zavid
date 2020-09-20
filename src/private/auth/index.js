const express = require('express');
const router = express.Router();
const expressSession = require('express-session');
// const MySQLStore = require('express-mysql-session')(expressSession);
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const { domain } = require('../../constants/settings');
const app = require('../singleton').getApp();
const server = require('../singleton').getServer();

const isDev = process.env.NODE_ENV !== 'production';

app.use(
  expressSession({
    name: process.env.SESSION_NAME,
    cookie: {
      httpOnly: false,
      maxAge: 2 * 60 * 60 * 1000,
      secure: !isDev
    },
    // store: new MySQLStore({
    //   host: process.env.MYSQL_HOST,
    //   port: process.env.PORT,
    //   user: process.env.MYSQL_USER,
    //   password: process.env.MYSQL_PWD,
    //   database: process.env.MYSQL_NAME,
    //   connectionLimit: 2,
    // }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((token, done) => {
  console.info('Serializing Zavid user');
  done(null, token);
});

passport.deserializeUser(function (id, done) {
  console.info('Deserializing Zavid user');
  done(null, { id });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${domain}/login/redirect`,
      passReqToCallback: true
    },
    function (req, accessToken, refreshToken, profile, done) {
      const isZavid = profile.id === process.env.GOOGLE_ACCOUNT_ID;
      if (isZavid) {
        done(null, accessToken);
      } else {
        req.session.destroy((err) => {
          if (err) console.error(err);
          done(null, false);
        });
      }
    }
  )
);

router.use('/admin', function (req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login');
  }
});

app.get(
  '/login',
  passport.authenticate('google', {
    scope: ['profile']
  })
);

app.get(
  '/login/redirect',
  passport.authenticate('google', {
    failureRedirect: '/logout'
  }),
  function (req, res) {
    return server.render(req, res, '/admin/redirect', {
      title: `Redirecting...`,
      user: req.user
    });
  }
);

app.get('/logout', function (req, res) {
  if (!req.session) res.redirect('/');
  req.session.destroy(() => {
    req.logout();
    server.render(req, res, '/admin/logout', {
      title: `Redirecting...`
    });
  });
});

module.exports = router;
