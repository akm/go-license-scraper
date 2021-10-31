import {Scraper} from './Scraper';
import {ModVersion} from './ModVersion';

export const execute = async (linesText: string): Promise<void> => {
  await Scraper.process(async scraper => {
    const lines = linesText.split('\n');
    for (const line of lines) {
      if (!line.trim()) continue;

      const mod = ModVersion.parse(line);
      try {
        const license = await scraper.process(mod);
        process.stdout.write(JSON.stringify(license));
        process.stdout.write('\n');
      } catch (
        err: any // eslint-disable-line @typescript-eslint/no-explicit-any
      ) {
        process.stderr.write(err.message);
      }
    }
  });
};
