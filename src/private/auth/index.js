const express = require('express');
const router = express.Router();
const expressSession = require('express-session');
const MemoryStore = require('memorystore')(expressSession);
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const { domain } = require('../../constants/settings');
const app = require('../singleton').getApp();

const isDev = process.env.NODE_ENV !== 'production';

const authCookieOptions = {
  maxAge: 2 * 60 * 1000,
  httpOnly: false
};

app.set('trust proxy', 1);
app.use(
  expressSession({
    name: process.env.SESSION_NAME,
    cookie: {
      httpOnly: false,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: !isDev
    },
    store: new MemoryStore({
      checkPeriod: 24 * 60 * 60 * 1000
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
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

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  done(null, { id });
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
    res.cookie('justAuthenticated', true, authCookieOptions);
    res.redirect(req.session.returnTo || '/');
  }
);

app.get('/logout', function (req, res) {
  if (!req.session) return res.redirect('/');
  req.session.destroy(() => {
    req.logout();
    res.cookie('justDeauthenticated', true, authCookieOptions);
    res.redirect('/');
  });
});

app.use('/admin', (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect('/login');
  }
});

module.exports = router;
