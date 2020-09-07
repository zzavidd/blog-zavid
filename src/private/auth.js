const express = require('express');
const router = express.Router();
const expressSession = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const app = require('./singleton').getApp();

const { domain } = require('../constants/settings');

app.use(
  expressSession({
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
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
    function (request, accessToken, refreshToken, profile, done) {
      return done(
        null,
        profile.id === process.env.GOOGLE_ACCOUNT_ID ? profile : false
      );
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