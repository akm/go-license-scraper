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
    const lines = input_string.split('\n');
    for (const line of lines) {
      await readAndWrite(scraper, line, process.stdout);
    }
  });
});
