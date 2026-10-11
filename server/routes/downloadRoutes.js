import { Router } from "express";
import { createRequire } from "module";
import path from "path";
import fs from "fs";

const require = createRequire(import.meta.url);
const archiver = require("archiver");

const router = Router();

function createMoveBandhuZip() {
  return new Promise((resolve, reject) => {
    try {
      const rootDir = process.cwd();
      const zipPath = path.resolve("/tmp/MoveBandhu.zip");

      if (fs.existsSync(zipPath)) {
        const stats = fs.statSync(zipPath);
        if (Date.now() - stats.mtimeMs < 10000 && stats.size > 10000) {
          return resolve(zipPath);
        }
      }

      const output = fs.createWriteStream(zipPath);
      const archive = archiver("zip", {
        zlib: { level: 9 },
        forceZip64: false
      });

      output.on("close", () => {
        resolve(zipPath);
      });

      archive.on("error", (err) => {
        reject(err);
      });

      archive.pipe(output);

      function addDirectory(srcDir, zipPrefix) {
        if (!fs.existsSync(srcDir)) return;
        const entries = fs.readdirSync(srcDir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(srcDir, entry.name);
          const zipEntryPath = path.join(zipPrefix, entry.name);

          if (entry.isDirectory()) {
            if (entry.name === "node_modules" || entry.name === "dist" || entry.name.startsWith(".")) {
              continue;
            }
            addDirectory(fullPath, zipEntryPath);
          } else if (entry.isFile()) {
            archive.file(fullPath, { name: zipEntryPath });
          }
        }
      }

      addDirectory(path.join(rootDir, "src"), "src");
      addDirectory(path.join(rootDir, "server"), "server");
      if (fs.existsSync(path.join(rootDir, "data"))) {
        addDirectory(path.join(rootDir, "data"), "data");
      }

      const rootFiles = [
        "server.js",
        "vite.config.js",
        "index.html",
        "package.json",
        ".env.example",
        "README.md",
        "MERN_QUICKSTART.md",
        "metadata.json"
      ];

      for (const file of rootFiles) {
        const fullPath = path.join(rootDir, file);
        if (fs.existsSync(fullPath)) {
          archive.file(fullPath, { name: file });
        }
      }

      archive.finalize();
    } catch (err) {
      reject(err);
    }
  });
}

const handleZipDownload = async (_req, res) => {
  try {
    const zipPath = path.resolve("/tmp/MoveBandhu.zip");
    if (fs.existsSync(zipPath)) {
      try {
        fs.unlinkSync(zipPath);
      } catch (e) {
      }
    }

    const createdPath = await createMoveBandhuZip();
    res.download(createdPath, "MoveBandhu.zip", (err) => {
      if (err && !res.headersSent) {
        console.error("Download transfer error:", err);
        res.status(500).json({ error: "Failed to download MoveBandhu.zip" });
      }
    });
  } catch (err) {
    console.error("Zip build error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to create MoveBandhu.zip", message: err?.message });
    }
  }
};

router.get(["/MoveBandhu.zip", "/Movemate.zip"], handleZipDownload);
router.get("/mern-zip", handleZipDownload);
router.get("/", handleZipDownload);

export default router;
