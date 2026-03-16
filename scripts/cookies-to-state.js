#!/usr/bin/env node
/**
 * cookies.txt (Netscape形式) → Playwright storageState (JSON) 変換
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const cookiesFile = process.argv[2] || 'note.com_cookies.txt';
const statePath = process.argv[3]
  || process.env.NOTE_POST_MCP_STATE_PATH
  || resolve(process.env.HOME || process.env.USERPROFILE || '.', '.note-state.json');

const raw = readFileSync(cookiesFile, 'utf-8');
const cookies = [];

for (const line of raw.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;

  const parts = trimmed.split('\t');
  if (parts.length < 7) continue;

  const [domain, , path, secure, expires, name, value] = parts;

  cookies.push({
    name,
    value,
    domain,
    path,
    expires: expires === '0' ? -1 : Number(expires),
    httpOnly: false,
    secure: secure === 'TRUE',
    sameSite: 'Lax',
  });
}

const state = { cookies, origins: [] };
writeFileSync(statePath, JSON.stringify(state, null, 2));
console.log(`Converted ${cookies.length} cookies → ${statePath}`);
