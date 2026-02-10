import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.join(__dirname, "..", "public", "images", "og-default.png");

const W = 1200;
const H = 630;

const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#0a1628"/>
      <stop offset="50%" style="stop-color:#0f1e41"/>
      <stop offset="100%" style="stop-color:#162a5a"/>
    </linearGradient>
    <linearGradient id="gld" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#8a7040;stop-opacity:0"/>
      <stop offset="20%" style="stop-color:#c8aa64;stop-opacity:1"/>
      <stop offset="80%" style="stop-color:#c8aa64;stop-opacity:1"/>
      <stop offset="100%" style="stop-color:#8a7040;stop-opacity:0"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect x="0" y="0" width="${W}" height="4" fill="#c8aa64" opacity="0.8"/>
  <rect x="0" y="${H - 4}" width="${W}" height="4" fill="#c8aa64" opacity="0.8"/>
  <text x="${W / 2}" y="250"
        font-family="Helvetica Neue,Helvetica,Arial,sans-serif"
        font-size="108" font-weight="700" fill="#ffffff"
        text-anchor="middle" letter-spacing="18">LAEMTHONG</text>
  <text x="${W / 2}" y="320"
        font-family="Helvetica Neue,Helvetica,Arial,sans-serif"
        font-size="48" font-weight="300" fill="#b4c8dc"
        text-anchor="middle" letter-spacing="12">Syndicate</text>
  <line x1="${W / 2 - 180}" y1="365" x2="${W / 2 + 180}" y2="365"
        stroke="url(#gld)" stroke-width="1.5"/>
  <polygon points="${W / 2},358 ${W / 2 + 7},365 ${W / 2},372 ${W / 2 - 7},365"
           fill="#c8aa64"/>
  <text x="${W / 2}" y="415"
        font-family="Helvetica Neue,Helvetica,Arial,sans-serif"
        font-size="26" font-weight="400" fill="#c8aa64"
        text-anchor="middle" letter-spacing="4">Industrial Welding Equipment Since 1963</text>
  <text x="${W / 2}" y="${H - 30}"
        font-family="Helvetica Neue,Helvetica,Arial,sans-serif"
        font-size="14" font-weight="300" fill="#ffffff"
        text-anchor="middle" opacity="0.3" letter-spacing="2">laemthong-syndicate.vercel.app</text>
</svg>`;

try {
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(outputPath);
  console.log("SUCCESS: OG image generated at " + outputPath);
} catch (err) {
  console.error("Error:", err.message);
  process.exit(1);
}
