import {Page} from 'playwright';

export class Scraper {
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
}
