/**
 * Single-file standalone bundler
 * Inlines all src/*.js modules into a single production index.html inside dist/
 * Perfect for zero-asset iframe embedding or portable offline distribution.
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const indexPath = path.join(rootDir, 'index.html');
const distPath = path.join(rootDir, 'dist', 'index.html');

let html = fs.readFileSync(indexPath, 'utf8');

const scripts = [
  'src/audio.js',
  'src/posts.js',
  'src/upgrades.js',
  'src/events.js',
  'src/achievements.js',
  'src/tutorial.js',
  'src/sim.js',
  'src/ui.js'
];

let bundleJs = '/* The Echo Chamber Simulator - Embedded Bundle */\n';

for (const relPath of scripts) {
  const fullPath = path.join(rootDir, relPath);
  const code = fs.readFileSync(fullPath, 'utf8');
  bundleJs += `\n/* --- ${relPath} --- */\n` + code + '\n';
}

// Replace external script tags with bundled inline script
const scriptTagsRegex = /<!-- CORE GAME SCRIPTS -->[\s\S]*?<!-- MAIN GAME INITIALIZER & TICK LOOP -->/;
const replacement = `<!-- INLINED CORE BUNDLE -->\n  <script>\n${bundleJs}\n  </script>\n\n  <!-- MAIN GAME INITIALIZER & TICK LOOP -->`;

const bundledHtml = html.replace(scriptTagsRegex, replacement);

fs.writeFileSync(distPath, bundledHtml, 'utf8');
console.log(`[SUCCESS] Bundled standalone file generated: ${distPath} (${(bundledHtml.length / 1024).toFixed(1)} KB)`);

