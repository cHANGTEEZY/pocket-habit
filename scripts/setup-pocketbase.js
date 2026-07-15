#!/usr/bin/env node
/**
 * Downloads the PocketBase binary for the current OS/arch into ./pocketbase
 * Usage: npm run pocketbase:setup
 */
const { execSync } = require("node:child_process");
const fs = require("node:fs");
const https = require("node:https");
const os = require("node:os");
const path = require("node:path");
const { pipeline } = require("node:stream/promises");
const { createWriteStream } = require("node:fs");

const VERSION = "0.39.6";
const ROOT = path.resolve(__dirname, "..");
const BINARY = path.join(ROOT, "pocketbase");
const ZIP = path.join(ROOT, "pocketbase-download.zip");

function platformAsset() {
  const platform = os.platform();
  const arch = os.arch();

  const map = {
    "darwin-arm64": "darwin_arm64",
    "darwin-x64": "darwin_amd64",
    "linux-arm64": "linux_arm64",
    "linux-x64": "linux_amd64",
    "win32-arm64": "windows_arm64",
    "win32-x64": "windows_amd64",
  };

  const key = `${platform}-${arch}`;
  const asset = map[key];
  if (!asset) {
    throw new Error(`Unsupported platform: ${key}`);
  }
  return asset;
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (
          res.statusCode &&
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          download(res.headers.location, dest).then(resolve).catch(reject);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`Download failed: HTTP ${res.statusCode}`));
          return;
        }
        pipeline(res, createWriteStream(dest)).then(resolve).catch(reject);
      })
      .on("error", reject);
  });
}

async function main() {
  if (fs.existsSync(BINARY)) {
    console.log(`PocketBase already present at ${BINARY}`);
    console.log("Run: npm run pocketbase");
    return;
  }

  const asset = platformAsset();
  const url = `https://github.com/pocketbase/pocketbase/releases/download/v${VERSION}/pocketbase_${VERSION}_${asset}.zip`;
  console.log(`Downloading PocketBase v${VERSION} (${asset})...`);
  await download(url, ZIP);

  console.log("Extracting...");
  execSync(`unzip -o "${ZIP}" pocketbase -d "${ROOT}"`, { stdio: "inherit" });
  fs.unlinkSync(ZIP);

  if (os.platform() !== "win32") {
    fs.chmodSync(BINARY, 0o755);
  }

  console.log(`Installed: ${BINARY}`);
  console.log("Start with: npm run pocketbase");
  console.log("Admin UI:   http://127.0.0.1:8090/_/");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
