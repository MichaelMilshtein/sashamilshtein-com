import { createWriteStream, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPublic = path.resolve(__dirname, "../dist/public");
const outZip = path.resolve(__dirname, "../dist/resume-hostinger.zip");

if (!existsSync(distPublic)) {
  console.error(`Build output not found at: ${distPublic}`);
  process.exit(1);
}

const { default: archiver } = await import("archiver");

const output = createWriteStream(outZip);
const archive = archiver("zip", { zlib: { level: 9 } });

output.on("close", () => {
  const sizeKB = Math.round(archive.pointer() / 1024);
  console.log(`\nZip created: dist/resume-hostinger.zip (${sizeKB} KB)`);
});

archive.on("warning", (err) => {
  if (err.code !== "ENOENT") throw err;
  console.warn("Warning:", err.message);
});

archive.on("error", (err) => {
  throw err;
});

archive.pipe(output);
archive.directory(distPublic, false);

await archive.finalize();
