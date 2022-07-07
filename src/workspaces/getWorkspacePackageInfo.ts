import path from "path";
import fs from "fs";
import { WorkspaceInfo } from "../types/WorkspaceInfo";
import { PackageInfo } from "../types/PackageInfo";

export function getWorkspacePackageInfo(workspacePaths: string[]): WorkspaceInfo[] {
  if (!workspacePaths) {
    return [];
  }

  return workspacePaths
    .map<WorkspaceInfo | undefined>((workspacePath) => {
      let packageJson: PackageInfo;
      const packageJsonPath = path.join(workspacePath, "package.json");

      try {
        packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8")) as PackageInfo;
      } catch {
        return;
      }

      return {
        name: packageJson.name,
        path: workspacePath,
        packageJson: {
          ...packageJson,
          packageJsonPath,
        },
      };
    })
    .filter((w): w is WorkspaceInfo => !!w);
}
