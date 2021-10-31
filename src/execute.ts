import {chromium} from 'playwright';
import {Scraper} from './Scraper';
import {Builder} from './Builder';
import {ModVersion} from './ModVersion';
import {License} from './License';

export const execute = async (linesText: string): Promise<void> => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const scraper = new Scraper(page);

  try {
    const lines = linesText.split('\n');
    for (const line of lines) {
      if (!line.trim()) continue;

      const mod = ModVersion.parse(line);
      const patterns = new Builder(mod).patterns;
      try {
        const r = await scraper.run(patterns);
        const license: License = {
          path: mod.path,
          version: mod.version,
          license: r.license,
          url: r.url,
        };
        process.stdout.write(JSON.stringify(license));
        process.stdout.write('\n');
      } catch (
        err: any // eslint-disable-line @typescript-eslint/no-explicit-any
      ) {
        process.stderr.write(err.message);
      }
    }
  } finally {
    await browser.close();
  }
};
