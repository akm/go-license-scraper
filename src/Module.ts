export type Module = {
  readonly path: string; // "Path"
  readonly version: string; // "Version"
  readonly main: boolean; // "Main"
  // readonly time: string; // "Time"
  // readonly indirect: boolean; // "Indirect"
  // readonly dir: string; // "Dir"
  // readonly goMod: string; // "GoMod"
  // readonly goVersion: string; // "GoVersion"
};

class ModuleCompanion {
  parse(line: string): Module {
    const d = JSON.parse(line);
    const path = d['Path'] as string;
    const version = d['Version'] as string;
    const main = (d['Main'] || false) as boolean;
    return {path, version, main};
  }
}

export const Module = new ModuleCompanion();
