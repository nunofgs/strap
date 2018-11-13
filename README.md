# Strap
A script to bootstrap a minimal macOS development system.

## Features
- Disables Java in Safari (for better security)
- Enables the macOS screensaver password immediately (for better security)
- Enables the macOS application firewall (for better security)
- Adds a `Found this computer?` message to the login screen (for machine recovery)
- Enables full-disk encryption and saves the FileVault Recovery Key to the Desktop (for better security)
- Installs the Xcode Command Line Tools (for compilers and Unix tools)
- Agree to the Xcode license (for using compilers without prompts)
- Installs [Homebrew](http://brew.sh) (for installing command-line software)
- Installs [Homebrew Bundle](https://github.com/Homebrew/homebrew-bundle) (for `bundler`-like `Brewfile` support)
- Installs [Homebrew Services](https://github.com/Homebrew/homebrew-services) (for managing Homebrew-installed services)
- Installs [Homebrew Cask](https://github.com/caskroom/homebrew-cask) (for installing graphical software)
- Installs the latest macOS software updates (for better security)
- Installs dotfiles from a user or organization's repository and runs `script/setup` to configure them.
- Installs software from a user's `Brewfile` in their `https://github.com/username/homebrew-brewfile` repository or `.Brewfile` in their home directory.
- A simple web application to set Git's name, email and GitHub token (needs authorization on any organisations you wish to access)
- Idempotent

## Usage
Open https://strap.uphold.com/ in your web browser.

Instead, to run Strap locally run:
```bash
git clone https://github.com/uphold/strap
cd strap
bash bin/strap.sh # or bash bin/strap.sh --debug for more debugging output
```

Instead, to run the web application locally run:
```bash
git clone https://github.com/uphold/strap
cd strap
GITHUB_CLIENT_ID="..." GITHUB_CLIENT_SECRET="..." node app.js
```

## Web Application Environment Variables
- `GITHUB_CLIENT_ID`: the GitHub.com Application Client ID.
- `GITHUB_CLIENT_SECRET`: the GitHub.com Application Client Secret.
- `PORT`: the port for the HTTP server (defaults to 3000).
- `SESSION_SECRET`: the secret used for cookie session storage.
- `STRAP_ISSUES_URL`: the URL where users should file issues (defaults to https://github.com/uphold/strap/issues/new).

## Credits

Original idea was from [mikemcquaid/strap](https://github.com/mikemcquaid/strap).

## License

MIT
