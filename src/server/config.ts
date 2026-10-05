import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function applyEnvFile(filePath: string, { override = false } = {}) {
  if (!existsSync(filePath)) return;

  const source = readFileSync(filePath, "utf8");
  const lines = source.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index] ?? "";
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separatorIndex = rawLine.indexOf("=");
    if (separatorIndex <= 0) continue;

    const key = rawLine.slice(0, separatorIndex).trim();
    if (!key || (!override && process.env[key] !== undefined)) continue;

    let value = rawLine.slice(separatorIndex + 1).trim();
    if (value.startsWith('"') || value.startsWith("'")) {
      const quote = value[0];
      value = value.slice(1);

      while (!value.endsWith(quote) && index < lines.length - 1) {
        index += 1;
        value += `\n${lines[index] ?? ""}`;
      }

      if (value.endsWith(quote)) {
        value = value.slice(0, -1);
      }
    }

    process.env[key] = value;
  }
}

applyEnvFile(resolve(process.cwd(), ".env"));
applyEnvFile(resolve(process.cwd(), ".env.local"), { override: true });
if (process.env.ORIZONCP_ENV_PATH) {
  applyEnvFile(resolve(process.env.ORIZONCP_ENV_PATH), { override: true });
}

const orizoncpRepoUrl = "https://github.com/learnwithrichuncle/Orizon-CP.git";
const legacyOrizonCPRepoUrls = new Set([
  "https://github.com/akinloluwami/orizoncp",
  "https://github.com/akinloluwami/orizoncp.git",
  "git@github.com:akinloluwami/orizoncp",
  "git@github.com:akinloluwami/orizoncp.git"
]);

function normalizeOrizonCPRepoUrl(repoUrl: string) {
  return legacyOrizonCPRepoUrls.has(repoUrl.trim()) ? orizoncpRepoUrl : repoUrl;
}

function normalizeOrizonCPImage(image: string) {
  return image.trim().replace(/^ghcr\.io\/akinloluwami\/orizoncp(?=[:@]|$)/, "ghcr.io/learnwithrichuncle/orizon-cp");
}

const defaultOrizonCPImage = normalizeOrizonCPImage(process.env.ORIZONCP_IMAGE ?? "ghcr.io/learnwithrichuncle/orizon-cp:latest");
const orizoncpInstallDir = process.env.ORIZONCP_INSTALL_DIR ?? "/opt/orizoncp";
const defaultImageUpdateCmd = `docker rm -f orizoncp-self-updater >/dev/null 2>&1 || true; docker run -d --name orizoncp-self-updater -v /var/run/docker.sock:/var/run/docker.sock -v ${orizoncpInstallDir}:${orizoncpInstallDir} -w ${orizoncpInstallDir} ${defaultOrizonCPImage} sh -lc 'docker compose pull orizoncp && docker compose up -d --no-deps orizoncp'`;
const dataDir = resolve(process.env.DATA_DIR ?? "data");
const caddyDataDir = process.env.CADDY_DATA_DIR ?? (process.env.CADDY_RELOAD_CMD === "true" ? "/data" : dataDir);

export const config = {
  port: Number(process.env.PORT ?? 4310),
  host: process.env.HOST ?? "0.0.0.0",
  publicUrl: process.env.PUBLIC_URL ?? "http://localhost:5173",
  controlPlaneHostname: process.env.CONTROL_PLANE_HOSTNAME?.trim().toLowerCase() ?? "",
  dataDir,
  deployDryRun: process.env.DEPLOY_DRY_RUN === "true",
  githubAccessToken: process.env.GITHUB_ACCESS_TOKEN ?? "",
  githubAppId: process.env.GITHUB_APP_ID ?? "",
  githubAppClientId: process.env.GITHUB_APP_CLIENT_ID ?? "",
  githubAppSlug: process.env.GITHUB_APP_SLUG ?? "",
  githubAppPrivateKey: (process.env.GITHUB_APP_PRIVATE_KEY ?? "").replace(/\\n/g, "\n"),
  githubWebhookSecret: process.env.GITHUB_WEBHOOK_SECRET ?? "",
  buildkitHost: process.env.BUILDKIT_HOST ?? "tcp://127.0.0.1:1234",
  runtimeNetworkName: process.env.ORIZONCP_RUNTIME_NETWORK ?? "orizoncp-runtime",
  secretKey: process.env.ORIZONCP_SECRET_KEY ?? "",
  caddyConfigPath: resolve(process.env.CADDY_CONFIG_PATH ?? "data/Caddyfile"),
  caddyDataDir,
  caddyReloadCmd: process.env.CADDY_RELOAD_CMD ?? "caddy reload --config ./data/Caddyfile",
  updateRepoUrl: normalizeOrizonCPRepoUrl(process.env.ORIZONCP_UPDATE_REPO_URL ?? orizoncpRepoUrl),
  updateRepoBranch: process.env.ORIZONCP_UPDATE_BRANCH ?? "main",
  updateRestartCmd: process.env.ORIZONCP_UPDATE_RESTART_CMD ?? "",
  imageCommitSha: process.env.ORIZONCP_COMMIT_SHA ?? "",
  imageUpdateCmd: process.env.ORIZONCP_IMAGE_UPDATE_CMD ?? defaultImageUpdateCmd
};
