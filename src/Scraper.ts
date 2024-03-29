import {chromium, Page} from 'playwright-core';
import {Builder} from './Builder';
import {License} from './License';
import {Module} from './Module';
import {Processor} from './Processor';
import {UrlAndSelector} from './UrlAndSelector';

export class Scraper implements Processor {
  static async process(
    excludedModoules: string[],
    f: {(scraper: Scraper): Promise<void>}
  ): Promise<void> {
    // https://playwright.dev/docs/api/class-testoptions#test-options-channel
    const browserChannel = process.env.BROWSER_CHANNEL || 'chrome';
    const headless = !(
      process.env.HEADED === 'true' ||
      process.env.HEADED === 'on' ||
      process.env.HEADED === '1'
    );
    const browser = await chromium.launch({channel: browserChannel, headless});
    const page = await browser.newPage();

    const scraper = new Scraper(page, excludedModoules);
    try {
      await f(scraper);
    } finally {
      await browser.close();
    }
  }

  constructor(
    private readonly page: Page,
    readonly excludedModoules: string[]
  ) {}

  async scrape(url: string, selector: string): Promise<string | undefined> {
    const debug =
      process.env.DEBUG === 'true'
        ? (s: string) =>
            process.stderr.write(`${new Date().toISOString()} ${url} ${s}\n`)
        : () => {};
    debug('scrape #0');

    // Sometimes waitForLoadState('load') waits too long for external resources like https://slackin.goswagger.io/badge.svg
    // So, use documentloaded instead of load and waitForSelector to wait for the selector.
    await this.page.goto(url, {waitUntil: 'domcontentloaded'});
    debug('scrape #1 ${selector} waitForSelector start');

    // Request “github.com/aws/aws-sdk-go-v2@v1.20.3” というようなボタンが表示されている場合は、スキップ
    const requestButton = this.page.locator('[data-test-id="fetch-button"]');
    if (await requestButton.isVisible()) {
      await requestButton.click();
      throw new Error(`skip ${url} the page is not ready`);
    }
    await this.page.waitForSelector(selector);
    debug('scrape #2 ${selector} waitForSelector finish');

    // await page.pause();
    const scraped = await this.page.textContent(selector);
    debug('scrape #3 ${selector} got text ${scraped}');

    return scraped?.trim();
  }

  async getLicenseAndUrl(
    patterns: UrlAndSelector[]
  ): Promise<{license: string; url: string}> {
    const errors: any[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any
    for (const ptn of patterns) {
      try {
        const license = await this.scrape(ptn.url, ptn.selector);
        if (license !== undefined && license !== '') {
          return {
            license,
            url: ptn.url,
          };
        }
      } catch (
        err: any // eslint-disable-line @typescript-eslint/no-explicit-any
      ) {
        errors.push(err);
      }
    }

    process.stderr.write(errors.map(e => `${e}`).join('\n'));

    return {
      license: '(unknown)',
      url: patterns[0].url,
    };
  }

  async process(mod: Module): Promise<License> {
    if (this.excludedModoules.includes(mod.path)) {
      return {
        path: mod.path,
        version: '',
        license: '(included)',
        url: '',
      };
    }

    const patterns = new Builder(mod).patterns;
    const r = await this.getLicenseAndUrl(patterns);
    return {
      path: mod.path,
      version: mod.version,
      license: r.license,
      url: r.url,
    };
  }
}
