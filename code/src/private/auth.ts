import express, { Request } from 'express';
import expressSession, { Session } from 'express-session';
import memoryStore from 'memorystore';
import passport from 'passport';
import {
  Strategy as GoogleStrategy,
  VerifyCallback
} from 'passport-google-oauth2';

import { getApp } from './singleton';

import { domain } from '../constants/settings';

const isDev = process.env.NODE_ENV !== 'production';
const MemoryStore = memoryStore(expressSession);
const router = express.Router();
const app = getApp();

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
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${domain}/login/redirect`,
      passReqToCallback: true
    },
    function (
      req: Request,
      accessToken: string,
      refreshToken: string,
      profile: GoogleProfile,
      done: VerifyCallback
    ) {
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

passport.serializeUser(function (user: AuthenticatedUser, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id: number, done) {
  done(null, { id });
});

router.get(
  '/login',
  passport.authenticate('google', {
    scope: ['profile']
  })
);

router.get(
  '/login/redirect',
  passport.authenticate('google', { failureRedirect: '/' }),
  function (req, res) {
    res.cookie('justAuthenticated', true, authCookieOptions);
    res.redirect((req.session as CustomSession).returnTo || '/');
  }
);

router.get('/logout', function (req, res) {
  if (!req.session) return res.redirect('/');
  req.session.destroy(() => {
    req.logout();
    res.cookie('justDeauthenticated', true, authCookieOptions);
    res.redirect('/');
  });
});

router.use('/admin', (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    (req.session as CustomSession).returnTo = req.originalUrl;
    res.redirect('/login');
  }
});

export default router;

type GoogleProfile = {
  id?: string;
};

type AuthenticatedUser = {
  id: number;
};

type CustomSession = Session & { returnTo: string };
