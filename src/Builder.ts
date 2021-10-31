import {ModVersion} from './ModVersion';

const version0 = /^v0\.0\.0-/;

const pkgGoDevSelector =
  '[data-test-id=UnitHeader-licenses] [data-test-id=UnitHeader-license]';
const githubSelector = 'h3:has-text("License") + .mt-3 a';

type UrlAndSelector = {
  readonly url: string;
  readonly selector: string;
};

export class Builder {
  constructor(readonly modVersion: ModVersion) {}

  get path(): string {
    return this.modVersion.path;
  }
  get version(): string {
    return this.modVersion.version;
  }

  get patterns(): UrlAndSelector[] {
    const urls: string[] = [];
    const urlToSelector: {[key: string]: string} = {};

    const add = (url: string, selector: string) => {
      urls.push(url);
      urlToSelector[url] = selector;
    };

    if (!this.version.match(version0))
      add(`https://pkg.go.dev/${this.path}@${this.version}`, pkgGoDevSelector);
    add(`https://pkg.go.dev/${this.path}`, pkgGoDevSelector);

    if (this.path.match(/^github\.com\//)) {
      if (!this.version.match(version0))
        add(`https://${this.path}/tree/${this.version}`, githubSelector);
      add(`https://${this.path}`, githubSelector);
    }
    const r: UrlAndSelector[] = [];
    for (const url of urls) {
      const selector = urlToSelector[url];
      r.push({url, selector});
    }
    return r;
  }
}
