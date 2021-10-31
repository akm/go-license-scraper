import {chromium} from 'playwright';
import {Scraper} from './Scraper';
import {Builder} from './Builder';

export const execute = async (linesText: string): Promise<void> => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const scraper = new Scraper(page);

  try {
    const lines = linesText.split('\n');
    for (const line of lines) {
      if (!line.trim()) continue;

      const b = Builder.parseJson(line);
      const patterns = b.patterns;

      let success = false;
      const errors: any[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any
      for (const ptn of patterns) {
        try {
          const license = await scraper.run(ptn.url, ptn.selector);
          process.stdout.write(
            JSON.stringify({
              path: b.modVersion.path,
              version: b.modVersion.version,
              license,
              url: ptn.url,
            })
          );
          process.stdout.write('\n');
          success = true;
          break;
        } catch (
          err: any // eslint-disable-line @typescript-eslint/no-explicit-any
        ) {
          errors.push(err);
        }
      }
      if (!success && errors.length > 0) {
        process.stderr.write(
          `failed to get license at ${patterns
            .map(i => i.url)
            .join(',')} because of ${errors}\n`
        );
      }
    }
  } finally {
    await browser.close();
  }
};
