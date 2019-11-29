#!/usr/bin/env bats

setup() {
  CONFIG=$(cat << EOF
    {
      "STRAP_DOTFILES": "dotfiles-example",
      "STRAP_GIT_EMAIL": "foo@bar.com",
      "STRAP_GIT_NAME": "Foo Bar",
      "STRAP_GITHUB_ORGANIZATION_OR_USERNAME": "uphold",
      "STRAP_GITHUB_TOKEN": "token",
      "STRAP_GITHUB_USER": "foobar",
      "STRAP_ISSUES_URL": "https://github.com/uphold/strap/issues/new"
    }
EOF
  )

  # Execute script (skip file encryption since it prompts for user password)
  STRAP_CI=1 STRAP_DEBUG=1 bash <(ejs-cli bin/strap.sh -O "$CONFIG")
}

@test "should set git config" {
  [ "$(git config --get --global user.name)" = "Foo Bar" ]
  [ "$(git config --get --global user.email)" = "foo@bar.com" ]
  [ "$(git config --get --global github.user)" = "foobar" ]
}
