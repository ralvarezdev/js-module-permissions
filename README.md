# js-module-permissions

Module permissions for JavaScript projects. It maps a directory of scripts (modules) to a tree of permission managers, where each class method declares which user profiles may run it, and executes methods only if the caller's profile is allowed.

**Note:** This repository is archived and read-only.

Package `@ralvarezdev/js-module-permissions` (0.4.8, ES modules). Depends on `@ralvarezdev/js-decorator ^0.2.2` and `@ralvarezdev/js-reflection ^0.3.11`.

## Installation

npm publication was not verified; installing from GitHub works regardless:

```bash
npm install github:ralvarezdev/js-module-permissions
```

## API

Exported from `index.js`:

- **`AddMetadataProfiles(target, property, ...profiles)`** — stores the allowed profiles in the method's metadata (key `profiles`, via `js-decorator`). `GetMetadataProfiles(target, property)` reads them back.
- **`MigratePermissions({dirPath, matchScriptNameFn, classNameFn, instanceNameFn, logger})`** — walks `dirPath`: directories become nested modules, matching scripts become objects, and each method's profiles metadata becomes its allowed profiles. Returns the root `ModuleManager`. `MigratePermissionsToModuleManager` and `MigratePermissionsToObjectManager` are its lower-level steps.
- **`ModuleManager`** — tree node of nested modules and objects: `createNestedModule`, `getNestedModule`, `createObject`, `getObject`, `createMethod`, `canBeExecutedBy(route, profile)`, `executeMethod(route, profile, ...params)`, `safeExecuteMethod` (also checks the parameter count). Throws `User not authorized` for a disallowed profile.
- **`ObjectManager`** — per-class manager with `createMethod`, `allow`, `disallow`, `canBeExecutedBy`.
- **`MethodManager`** — per-method profiles: `allow`, `disallow`, `canBeExecutedBy`, `allowedProfiles`, `disallowedProfiles`.
- **`Route(baseDir, scriptName, objectName, methodName, ...modulesName)`** — location of a method.

## Example

```js
import { AddMetadataProfiles, MigratePermissions } from "@ralvarezdev/js-module-permissions";

class Users {
  list() {}
}
AddMetadataProfiles(Users, "list", "admin", "editor");

const root = await MigratePermissions({
  dirPath: "./modules",
  matchScriptNameFn: (name) => name.endsWith(".js"),
  classNameFn: (name) => /* class name from script name */ name,
  instanceNameFn: (name) => /* instance export name */ name,
});
```

The conventions for `classNameFn`, `instanceNameFn` and building a `Route` are not documented; see `permissions/migrate.js` and `permissions/moduleManager.js`.

## Project structure

```
index.js
permissions/   decorator.js, migrate.js, moduleManager.js, objectManager.js, methodManager.js, route.js
```

There are no tests.

## License

The repository has a GNU General Public License v3.0 `LICENSE` file, but `package.json` declares `ISC`; the two disagree.
