import {spawn} from 'child_process';

import {CsvFormatter} from './Formatter';
import {readAndWrite} from './readAndWrite';
import {Scraper} from './Scraper';

const golist = spawn('go', ['list', '-m ', '-json', 'all'], {shell: true});

let input_string = '';

golist.stdout.on('data', chunk => {
  input_string += chunk;
});

golist.stdout.on('end', () => {
  Scraper.process(async scraper => {
    const formatter = new CsvFormatter();
    const lines = input_string.split('}\n{').map(i => {
      let r = i.trim();
      if (!r.startsWith('{')) r = '{' + r;
      if (!r.endsWith('}')) r = r + '}';
      return r;
    });
    for (const line of lines) {
      await readAndWrite(scraper, line, formatter, process.stdout);
    }
  });
});
