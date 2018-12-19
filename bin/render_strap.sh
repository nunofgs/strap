#!/bin/bash
set -e

OUTPUT_FILE=bin/strap2.sh

ejs-cli bin/strap.sh -O '{ "STRAP_GIT_NAME": "First Last", "STRAP_GIT_EMAIL": "user@uphold.com", "STRAP_GITHUB_USER": "user", "STRAP_GITHUB_TOKEN": "token", "STRAP_ISSUES_URL": "https://github.com/uphold/strap/issues/new", "STRAP_GITHUB_ORGANIZATION_OR_USERNAME": "ricardobcl", "STRAP_DOTFILES": "dotfiles-1" }' > $OUTPUT_FILE
chmod +x $OUTPUT_FILE

