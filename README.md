# go-license-scraper

## Prerequisite

- [jq](https://stedolan.github.io/jq/)

## Install

```
$ npm install -g go-license-scraper
```

## Usage

```
$ cd path/to/your/directory/of/go.mod
$ go list -m -json all | jq -c 'select(.Main != true)' | go-license-scraper | jq -r '[.path, .version, .license, .url] | @csv'
```
