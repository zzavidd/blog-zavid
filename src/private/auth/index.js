const express = require('express');
const router = express.Router();
const expressSession = require('express-session');
const FileStore = require('session-file-store')(expressSession);
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const path = require('path');

const app = require('../singleton').getApp();

const isDev = process.env.NODE_ENV !== 'production';

const { domain } = require('../../constants/settings');

app.use(
  expressSession({
    name: process.env.SESSION_NAME,
    cookie: {
      httpOnly: false,
      maxAge: 2 * 60 * 60 * 1000,
      secure: !isDev
    },
    store: new FileStore({
      path: path.join(__dirname, 'sessions'),
      retries: 1
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  done(null, {});
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

router.use('/admin', (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.session.returnTo = req.originalUrl;
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
  passport.authenticate('google', { failureRedirect: '/' }),
  function (req, res) {
    res.redirect(req.session.returnTo || '/');
    delete req.session.returnTo;
  }
);

module.exports = router;
