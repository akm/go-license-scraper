import {Module} from './Module';
import {License} from './License';
import {Processor} from './Processor';

export type CacheKey = {
  path: string;
  version: string;
};

export type CacheValue = {
  license: string;
  url: string;
};

export class Cache {
  private map: {[key: string]: CacheValue} = {};

  private keyToString(key: CacheKey): string {
    return `${key.path}@${key.version}`;
  }
  set(key: CacheKey, value: CacheValue): void {
    this.map[this.keyToString(key)] = value;
  }
  get(key: CacheKey): CacheValue | undefined {
    return this.map[this.keyToString(key)];
  }
}

export class CacheProcessor implements Processor {
  constructor(private readonly impl: Processor, readonly cache: Cache) {}

  async process(mod: Module): Promise<License> {
    const value = this.cache.get(mod);
    if (value) {
      return {...mod, ...value};
    }
    return this.impl.process(mod);
  }
}
