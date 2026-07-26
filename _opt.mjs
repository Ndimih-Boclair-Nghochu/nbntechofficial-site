import sharp from "sharp";
import { readdirSync } from "fs";
const dir = "public/photos";
for (const f of readdirSync(dir).filter((f) => f.endsWith(".jpg"))) {
  const p = `${dir}/${f}`;
  const meta = await sharp(p).metadata();
  const buf = await sharp(p).resize({ width: 1600, withoutEnlargement: true }).jpeg({ quality: 72, mozjpeg: true }).toBuffer();
  await sharp(buf).toFile(p);
  console.log(f, `${meta.width}x${meta.height}`, "->", Math.round(buf.length / 1024) + "KB");
}
