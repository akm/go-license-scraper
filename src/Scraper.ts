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
    const browser = await chromium.launch({channel: browserChannel});
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
    await this.page.goto(url);
    await this.page.waitForLoadState();

    // await page.pause();
    const license = (
      await this.page.$eval(selector, el => el.textContent)
    )?.trim();
    return license;
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
    throw new Error(
      `failed to get license at ${patterns
        .map(i => i.url)
        .join(',')} because of ${errors}`
    );
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
