import {spawn, execFileSync} from 'child_process';
import {createWriteStream, existsSync} from 'fs';

import {CsvFormatter} from './Formatter';
import {Cache, CacheProcessor} from './Cache';
import {readAndWrite} from './readAndWrite';
import {Scraper} from './Scraper';

const exit = process.exit;
if (process.argv.length < 3) {
  process.stderr.write('Usage: go-license-scraper PATH_TO_LICENSE_CSV\n');
  exit(1);
}

const main = async () => {
  const csvPath = process.argv[2];

  const formatter = new CsvFormatter();

  const cache = existsSync(csvPath)
    ? await formatter.load(csvPath)
    : new Cache();

  // const includedPackages =
  const excludedModoules = (() => {
    try {
      return execFileSync('go', ['list'], {encoding: 'utf8'})
        .split('\n')
        .filter(i => i.trim());
    } catch (e) {
      return [];
    }
  })();

  const dest = createWriteStream(csvPath);

  const golist = spawn('go', ['list', '-m ', '-json', 'all'], {shell: true});

  let input_string = '';

  golist.stdout.on('data', chunk => {
    input_string += chunk;
  });

  golist.stdout.on('end', () => {
    Scraper.process(excludedModoules, async scraper => {
      const processor = new CacheProcessor(scraper, cache);
      const lines = input_string.split('}\n{').map(i => {
        let r = i.trim();
        if (!r.startsWith('{')) r = '{' + r;
        if (!r.endsWith('}')) r = r + '}';
        return r;
      });
      for (const line of lines) {
        await readAndWrite(processor, line, formatter, dest);
      }
    });
  });
};

main();
