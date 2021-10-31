import {CsvFormatter} from './Formatter';
import {readAndWrite} from './readAndWrite';
import {Scraper} from './Scraper';

process.stdin.resume();
process.stdin.setEncoding('utf8');
let input_string = '';

process.stdin.on('data', chunk => {
  input_string += chunk;
});

process.stdin.on('end', () => {
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
