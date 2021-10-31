import {chromium, Page} from 'playwright';
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

  async run(
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
}
