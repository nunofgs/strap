'use strict';

/**
 * Module exports.
 */

const { Strategy: GitHubStrategy } = require('passport-github2');

/**
 * Instances.
 */

const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET
} = process.env;

// Github strategy.
const strategy = new GitHubStrategy({
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  scope: 'user:email,repo'
}, (accessToken, refreshToken, profile, cb) => {
  strategy._oauth2._request('GET', profile._json.organizations_url, { 'Accept': 'application/vnd.github.v3+json' }, undefined, accessToken, (err, body) => {
    if (err) {
      return cb(err);
    }

    const organizations = JSON.parse(body).map(({ login }) => login);

    return cb(null, {
      accessToken,
      organizations,
      profile,
      refreshToken
    });
  });
});

/**
 * Export Github oauth strategy.
 */

module.exports = strategy;
