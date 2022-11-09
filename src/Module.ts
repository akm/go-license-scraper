export type Module = {
  readonly path: string; // "Path"
  readonly version: string; // "Version"
  readonly main: boolean; // "Main"
  // readonly time: string; // "Time"
  // readonly indirect: boolean; // "Indirect"
  // readonly dir: string; // "Dir"
  // readonly goMod: string; // "GoMod"
  // readonly goVersion: string; // "GoVersion"
  readonly replace?: Omit<Module, 'replace' | 'main' | 'version'>; // "Replace"
};

// {
//   "Path": "github.com/akm/repo1/app",
//   "Main": true,
//   "Dir": "/abstract/path/to/repo1/app",
//   "GoMod": "/abstract/path/to/repo1/app/go.mod",
//   "GoVersion": "1.16"
// }

// {
//   "Path": "cloud.google.com/go",
//   "Version": "v0.102.0",
//   "Time": "2022-05-24T20:09:33Z",
//   "Indirect": true,
//   "GoMod": "$HOME/.asdf/installs/golang/1.16.15/packages/pkg/mod/cache/download/cloud.google.com/go/@v/v0.102.0.mod",
//   "GoVersion": "1.15"
// }

//
// {
//   "Path": "github.com/akm/repo1/mod1",
//   "Version": "v0.0.0-00010101000000-000000000000",
//   "Replace": {
//           "Path": "../mod1",
//           "Dir": "/abstract/path/to/repo1/mod1",
//           "GoMod": "/abstract/path/to/repo1/mod1/go.mod",
//           "GoVersion": "1.16"
//   },
//   "Indirect": true,
//   "Dir": "/abstract/path/to/repo1/mod1",
//   "GoMod": "/abstract/path/to/repo1/mod1/go.mod",
//   "GoVersion": "1.16"
// }

class ModuleCompanion {
  parse(line: string): Module {
    const d = JSON.parse(line);
    const path = d['Path'] as string;
    const version = d['Version'] as string;
    const main = (d['Main'] || false) as boolean;
    const replace = d['Replace']
      ? {path: d['Replace']['Path'] as string}
      : undefined;
    return {path, version, main, replace};
  }
}

export const Module = new ModuleCompanion();
