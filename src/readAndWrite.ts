import {Scraper} from './Scraper';
import {ModVersion} from './ModVersion';

export const readAndWrite = async (
  scraper: Scraper,
  line: string
): Promise<void> => {
  if (!line.trim()) return;
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
};
