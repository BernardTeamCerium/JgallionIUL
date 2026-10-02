// Renders guide/iul-guide.html to public/downloads/jgallion-iul-guide.pdf.
// Usage: npx -y -p playwright node guide/build.js   (or with playwright installed)
const path = require("path");
const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const page = await browser.newPage();
  await page.goto("file://" + path.join(__dirname, "iul-guide.html"), { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  const out = path.join(__dirname, "..", "public", "downloads", "jgallion-iul-guide.pdf");
  await page.pdf({ path: out, format: "Letter", printBackground: true, preferCSSPageSize: true });
  await browser.close();
  console.log("Wrote", out);
})();
