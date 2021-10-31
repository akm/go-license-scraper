# go-license-scraper

go-license-scraper collects go module license by scraping http://pkg.go.dev (or http://github.com if its path includes github.com) with [Playwright](https://playwright.dev/).

## Prerequisite

- [Node.js](https://nodejs.org/)
- Your Golang project

## Install

```
$ npm install -g go-license-scraper
```

## Usage

```
$ cd path/to/your/directory/of/go.mod
$ go list -m -json all | go-license-scraper
```
