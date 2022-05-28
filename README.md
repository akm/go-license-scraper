# go-license-scraper

go-license-scraper collects go module license by scraping http://pkg.go.dev (or http://github.com if its path includes github.com) with [Playwright](https://playwright.dev/).

## Prerequisite

- [Node.js](https://nodejs.org/)
- [Google Chrome](https://www.google.com/chrome/)
- Your Golang project

## Install

```
$ npm install --location=global go-license-scraper
```

## Usage

```
$ cd path/to/your/directory/of/go.mod
$ go-license-scraper PATH/TO/LICENSES.csv
```

### Chrome Canary or Microsoft Edge

Set browser channel to environment variable `BROWSER_CHANNEL`.
If you want to use Microsoft Edge instead of Chrome, set `msedge`.
See https://playwright.dev/docs/api/class-testoptions#test-options-channel for more details.
