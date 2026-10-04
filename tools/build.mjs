#!/usr/bin/env node
/* Builds dist/szlakownik-single.html: the whole app in one file (Leaflet inlined).
   Handy for a quick look from disk or any static host; the full PWA (offline shell) is the folder itself. */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');
const index = read('index.html');
const body = index.slice(index.indexOf('<!-- APP:START -->') + '<!-- APP:START -->'.length, index.indexOf('<!-- APP:END -->'));
const icon192 = readFileSync(join(root, 'icons/icon-192.png')).toString('base64');

mkdirSync(join(root, 'dist'), { recursive: true });
const single = `<!doctype html>
<html lang="pl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1, user-scalable=no">
<title>Szlakownik</title>
<meta name="theme-color" content="#2f6b3a">
<link rel="icon" href="data:image/png;base64,${icon192}">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600&family=Barlow+Semi+Condensed:wght@500;600;700&display=swap">
<style>${read('vendor/leaflet.css')}</style>
<style>${read('app.css')}</style>
</head>
<body>${body}
<script>${read('vendor/leaflet.js')}</script>
<script>${read('app.js')}</script>
</body>
</html>
`;
writeFileSync(join(root, 'dist/szlakownik-single.html'), single);
console.log('dist/szlakownik-single.html', single.length, 'bytes');
