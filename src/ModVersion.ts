export type ModVersion = {
  readonly path: string;
  readonly version: string;
};

class ModVersionCompanion {
  parse(line: string): ModVersion {
    const d = JSON.parse(line);
    const path = d['Path'] as string;
    const version = d['Version'] as string;
    return {path, version};
  }
}

export const ModVersion = new ModVersionCompanion();
