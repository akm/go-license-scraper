import {createReadStream} from 'fs';
import {parse} from '@fast-csv/parse';

import {Cache} from './Cache';
import {License} from './License';

export interface Formatter {
  format(v: License): string;
}

export class CsvFormatter implements Formatter {
  format(v: License): string {
    return [v.path, v.version, v.license, v.url].map(i => `"${i}"`).join(',');
  }

  async load(filepath: string): Promise<Cache> {
    return new Promise<Cache>((resolve, reject) => {
      const cache = new Cache();
      createReadStream(filepath)
        .pipe(parse({headers: false}))
        .on('error', err => reject(err))
        .on('data', data => {
          // console.log('csv on data', data);
          const [path, version, license, url] = data;
          cache.set({path, version}, {license, url});
        })
        .on('end', () => resolve(cache));
    });
  }
}
