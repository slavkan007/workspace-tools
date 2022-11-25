import fs from "fs";
import path from "path";
import { PackageInfos } from "./types/PackageInfo";
import { infoFromPackageJson } from "./infoFromPackageJson";
import { getAllPackageJsonFiles } from "./workspaces/workspaces";

export function getPackageInfos(cwd: string) {
  let packageJsonFiles = getAllPackageJsonFiles(cwd);

  if (packageJsonFiles.length === 0 && fs.existsSync(path.join(cwd, "package.json"))) {
    packageJsonFiles = [path.join(cwd, "package.json")];
  }

  const packageInfos: PackageInfos = {};
  if (packageJsonFiles && packageJsonFiles.length > 0) {
    packageJsonFiles.forEach((packageJsonPath: string) => {
      try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
        packageInfos[packageJson.name] = infoFromPackageJson(packageJson, packageJsonPath);
      } catch (e) {
        if (e instanceof Error) {
          // Pass, the package.json is invalid
          throw new Error(`Invalid package.json file detected ${packageJsonPath}: ${e.message}`);
        } else {
          throw e;
        }
      }
    });
    return packageInfos;
  }

  return {};
}