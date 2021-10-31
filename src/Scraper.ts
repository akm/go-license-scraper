import {chromium, Page} from 'playwright';
import {Builder} from './Builder';
import {License} from './License';
import {ModVersion} from './ModVersion';
import {UrlAndSelector} from './UrlAndSelector';

export class Scraper {
  static async process(f: {(scraper: Scraper): Promise<void>}): Promise<void> {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    const scraper = new Scraper(page);
    try {
      f(scraper);
    } finally {
      await browser.close();
    }
  }

  constructor(private readonly page: Page) {}

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

  async process(mod: ModVersion): Promise<License> {
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
