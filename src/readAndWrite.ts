import {Scraper} from './Scraper';
import {Module} from './Module';

export const readAndWrite = async (
  scraper: Scraper,
  line: string,
  dest: NodeJS.WriteStream
): Promise<void> => {
  if (!line.trim()) return;
  const mod = Module.parse(line);
  if (mod.main) return; // Main module is not targeted
  try {
    const license = await scraper.process(mod);
    dest.write(JSON.stringify(license));
    dest.write('\n');
  } catch (
    err: any // eslint-disable-line @typescript-eslint/no-explicit-any
  ) {
    process.stderr.write(err.message);
  }
};
