const express = require('express');
const router = express.Router();
const expressSession = require('express-session');
const MemoryStore = require('memorystore')(expressSession);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// const GoogleStrategy = require('passport-google-oauth2').Strategy;

// const { domain } = require('../../constants/settings');
const app = require('../singleton').getApp();
const server = require('../singleton').getServer();

const isDev = process.env.NODE_ENV !== 'production';

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
  // new GoogleStrategy(
  //   {
  //     clientID: process.env.GOOGLE_CLIENT_ID,
  //     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  //     callbackURL: `${domain}/login/redirect`,
  //     passReqToCallback: true
  //   },
  //   function (req, accessToken, refreshToken, profile, done) {
  //     const isZavid = profile.id === process.env.GOOGLE_ACCOUNT_ID;
  //     if (isZavid) {
  //       done(null, profile);
  //     } else {
  //       req.session.destroy((err) => {
  //         if (err) console.error(err);
  //         done(null, false);
  //       });
  //     }
  //   }
  // )

  'local',
  new LocalStrategy(
    {
      passReqToCallback: true
    },
    function (req, username, password, done) {
      /** Compare passwords with hash */
      if (password !== process.env.LOCAL_PWD) {
        return done(null, false);
      }

      /** Everything's okay. Return successful user */
      return done(null, { id: process.env.GOOGLE_ACCOUNT_ID });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  done(null, { id });
});

app
  .route('/login')
  .get(function (req, res) {
    return server.render(req, res, '/admin/login', {
      title: `Login`
    });
  })
  .post(passport.authenticate('local'), function (req, res) {
    req.login({ id: process.env.GOOGLE_ACCOUNT_ID }, function (err) {
      if (err) return res.status(400).send(err.toString());
      res.redirect(req.session.returnTo || '/admin');
    });
  });

app.get('/logout', function (req, res) {
  if (!req.session) res.redirect('/');
  req.session.destroy(() => {
    req.logout();
    server.render(req, res, '/admin/logout', {
      title: `Redirecting...`
    });
  });
});

// app.get('/redirect', function (req, res) {
//   return server.render(req, res, '/admin/redirect', {
//     title: `Redirecting...`,
//     user: req.user
//   });
// });

// app.get(
//   '/login/redirect',
//   passport.authenticate('google', {
//     successRedirect: '/redirect',
//     failureRedirect: '/logout'
//   })
// );

const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect('/login');
  }
};

app.use('/admin', checkAuthenticated);

module.exports = router;
