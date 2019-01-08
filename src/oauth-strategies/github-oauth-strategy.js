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
  clientSecret: GITHUB_CLIENT_SECRET
}, (accessToken, refreshToken, profile, cb) => {
  strategy._oauth2._request('GET', 'https://api.github.com/user/orgs', { 'Accept': 'application/vnd.github.v3+json' }, undefined, accessToken, (err, body) => {
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
