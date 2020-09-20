const express = require('express');
const router = express.Router();
const expressSession = require('express-session');
const MemoryStore = require('memorystore')(expressSession);
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
    store: new MemoryStore({
      checkPeriod: 24 * 60 * 60 * 1000
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());

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
        done(null, profile);
      } else {
        req.session.destroy((err) => {
          if (err) console.error(err);
          done(null, false);
        });
      }
    }
  )
);

passport.serializeUser((user, done) => {
  console.info('Serializing Zavid user');
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  console.info('Deserializing Zavid user');
  done(null, { id });
});

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

app.get('/redirect', function (req, res) {
  return server.render(req, res, '/admin/redirect', {
    title: `Redirecting...`,
    user: req.user
  });
});

app.get(
  '/login/redirect',
  passport.authenticate('google', {
    successRedirect: '/redirect',
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
