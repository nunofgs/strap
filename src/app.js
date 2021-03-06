'use strict';

/**
 * Module dependencies.
 */

const { randomBytes } = require('crypto');
const Koa = require('koa');
const Router = require('koa-router');
const githubOauthStrategy = require('./oauth-strategies/github-oauth-strategy');
const passport = require('koa-passport');
const serverless = require('serverless-http');
const session = require('koa-session');
const views = require('koa-views');

/**
 * Instances.
 */

const app = new Koa();
const router = new Router({ strict: true });
const {
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
    scope: ['user:email', 'read:org', 'repo'],
    successReturnToOrRedirect: './'
  }))
  .get('/strap.sh', async context => {
    if (context.isUnauthenticated()) {
      return context.redirect('./');
    }

    context.attachment('strap.sh');

    const { accessToken, organizations, profile } = context.session.passport.user;
    const email = profile.emails[0].value;
    const organizationOrUsername = context.query.organization || profile.username;
    const dotfilesRepo = context.query.dotfiles_repo || "dotfiles";

    if (![profile.username].concat(organizations).includes(organizationOrUsername)) {
      throw new Error('Invalid organization or username');
    }

    await context.render('../bin/strap.sh', {
      STRAP_GIT_EMAIL: email,
      STRAP_GIT_NAME: profile.displayName,
      STRAP_GITHUB_ORGANIZATION_OR_USERNAME: organizationOrUsername,
      STRAP_GITHUB_TOKEN: accessToken,
      STRAP_GITHUB_USER: profile.username,
      STRAP_DOTFILES: dotfilesRepo
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
  .use(views(__dirname + '/../public', { map: { html: 'ejs', sh: 'ejs' } }))
  .use(passport.initialize())
  .use(passport.session())
  .use(async (context, next) => {
    try {
      await next();
    } catch (error) {
      // Make sure that the content-disposition is not set to attachment,
      // to not download the error page.
      context.remove('content-disposition');

      await context.render('error.html', { error });
    }
  })
  .use(router.routes())
  .use(router.allowedMethods());

// Export app.
module.exports.handler = serverless(app);
