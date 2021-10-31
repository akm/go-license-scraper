import {readAndWrite} from './readAndWrite';

process.stdin.resume();
process.stdin.setEncoding('utf8');
let input_string = '';

process.stdin.on('data', chunk => {
  input_string += chunk;
});

process.stdin.on('end', () => {
  readAndWrite(input_string);
});
