import {License} from './License';

export interface Formatter {
  format(v: License): string;
}

export class CsvFormatter implements Formatter {
  format(v: License): string {
    return [v.path, v.version, v.license, v.url].map(i => `"${i}"`).join(',');
  }
}
