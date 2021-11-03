import {License} from './License';
import {Module} from './Module';

export interface Processor {
  process(mod: Module): Promise<License>;
}
