'use strict';

/**
 * Module dependencies.
 */

const { randomBytes } = require('crypto');
const githubOauthStrategy = require('./oauth-strategies/github-oauth-strategy');
const Koa = require('koa');
const passport = require('koa-passport');
const Router = require('koa-router');
const session = require('koa-session');
const views = require('koa-views');

/**
 * Instances.
 */

const app = new Koa();
const router = new Router();
const {
  PORT = 3000,
  SESSION_SECRET
} = process.env;

// Session cookie.
app.keys = [SESSION_SECRET || randomBytes(32).toString('hex')];

// Setup routes.
router
  .get('/', async context => {
    await context.render('index.html');
  })
  .get('/github', passport.authenticate('github', {
    scope: 'user:email,repo',
    successReturnToOrRedirect: './'
  }))
  .get('/strap.sh', async context => {
    if (context.isUnauthenticated()) {
        return context.redirect('./');
      }

    context.attachment('strap.sh');

    const { accessToken, organizations, profile } = context.session.passport.user;
    const email = profile.emails.find(({ primary, verified }) => primary === true && verified === true);
    const organization = context.query.organization || profile.username;

    if (!~[profile.username].concat(organizations).indexOf(organization)) {
      throw new Error('Invalid organization');
    }

    await context.render('../../bin/strap.sh', {
      STRAP_GIT_EMAIL: email.value,
      STRAP_GIT_NAME: profile.displayName,
      STRAP_GITHUB_ORGANIZATION: organization,
      STRAP_GITHUB_TOKEN: accessToken,
      STRAP_GITHUB_USER: profile.username
    });
  });

// Setup passport serialization.
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser(async (user, done) => done(null, user));

// Setup passport strategies.
passport.use(githubOauthStrategy);

// Setup app.
app
  .use(session(app))
  .use(views(__dirname + '/public', { map: { html: 'ejs', sh: 'ejs' } }))
  .use(passport.initialize())
  .use(passport.session())
  .use(async (context, next) => {
    try {
      await next();
    } catch (error) {
      // make sure that the content-disposition is not set to attachment, to not download the error page
      context.response.remove('content-disposition');
      await context.render('error.html', { error });
    }
  })
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(PORT);
