import {WriteStream} from 'fs';

import {Scraper} from './Scraper';
import {Module} from './Module';
import {Formatter} from './Formatter';

export const readAndWrite = async (
  scraper: Scraper,
  line: string,
  formatter: Formatter,
  dest: WriteStream
): Promise<void> => {
  if (!line.trim()) return;
  const mod = Module.parse(line);
  if (mod.main) return; // Main module is not targeted
  try {
    const license = await scraper.process(mod);
    const output = formatter.format(license);
    dest.write(output);
    dest.write('\n');
  } catch (
    err: any // eslint-disable-line @typescript-eslint/no-explicit-any
  ) {
    process.stderr.write(err.message);
  }
};
