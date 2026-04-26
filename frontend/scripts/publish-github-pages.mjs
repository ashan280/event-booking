import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { execSync } from "node:child_process";

const frontendDir = resolve(process.cwd());
const repoRoot = resolve(frontendDir, "..");
const tempOutDir = resolve(repoRoot, ".pages-dist");
const repoName = process.env.GITHUB_PAGES_REPO || "event-booking";
const basePath = `/${repoName}/`;
const deploymentPaths = ["assets", "images", "index.html", "404.html", ".nojekyll"];

function cleanRootDeployment() {
  for (const entry of deploymentPaths) {
    const target = resolve(repoRoot, entry);
    if (existsSync(target)) {
      rmSync(target, { force: true, recursive: true });
    }
  }
}

function copyBuildToRoot() {
  for (const entry of readdirSync(tempOutDir)) {
    const source = resolve(tempOutDir, entry);
    const target = resolve(repoRoot, entry);
    cpSync(source, target, { recursive: true });
  }
}

function createSpaFiles() {
  const indexPath = resolve(repoRoot, "index.html");
  const notFoundPath = resolve(repoRoot, "404.html");
  const noJekyllPath = resolve(repoRoot, ".nojekyll");
  const indexHtml = readFileSync(indexPath, "utf8");

  writeFileSync(notFoundPath, indexHtml);
  writeFileSync(noJekyllPath, "");
}

mkdirSync(tempOutDir, { recursive: true });
cleanRootDeployment();
rmSync(tempOutDir, { force: true, recursive: true });

execSync("npm run build", {
  cwd: frontendDir,
  env: {
    ...process.env,
    VITE_BASE_PATH: basePath,
    VITE_OUT_DIR: tempOutDir
  },
  stdio: "inherit"
});

copyBuildToRoot();
createSpaFiles();
rmSync(tempOutDir, { force: true, recursive: true });
