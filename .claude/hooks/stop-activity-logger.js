#!/usr/bin/env node
/**
 * Stop Activity Logger
 *
 * Stopフック: 各レスポンス終了時に作業ログを記録
 * - .claude/rules/CLAUDE.md の Recent Activity を更新
 * - .claude/hooks/data/activity-log.jsonl に追記
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CWD = process.cwd();
const RULES_CLAUDE_MD = path.join(CWD, '.claude/rules/CLAUDE.md');
const ACTIVITY_LOG = path.join(CWD, '.claude/hooks/data/activity-log.jsonl');
const MAX_RECENT = 10; // Recent Activity に表示する最大件数

function readStdin(timeout = 1500) {
  return new Promise((resolve) => {
    let data = '';
    let resolved = false;
    const finish = () => { if (!resolved) { resolved = true; resolve(data); } };
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => { data += chunk; });
    process.stdin.on('end', finish);
    process.stdin.on('error', finish);
    setTimeout(finish, timeout);
    if (process.stdin.isTTY) finish();
  });
}

function getGitActivity() {
  try {
    const status = execSync('git diff --name-only HEAD 2>/dev/null', { cwd: CWD, encoding: 'utf8', timeout: 2000 }).trim();
    const staged = execSync('git diff --name-only --cached 2>/dev/null', { cwd: CWD, encoding: 'utf8', timeout: 2000 }).trim();
    const files = [...new Set([...status.split('\n'), ...staged.split('\n')].filter(Boolean))];
    return files.length > 0 ? files.slice(0, 5).join(', ') : null;
  } catch (e) {
    return null;
  }
}

function loadActivityLog() {
  try {
    if (!fs.existsSync(ACTIVITY_LOG)) return [];
    const lines = fs.readFileSync(ACTIVITY_LOG, 'utf8').trim().split('\n').filter(Boolean);
    return lines.map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
  } catch (e) {
    return [];
  }
}

function appendActivityLog(entry) {
  try {
    const dir = path.dirname(ACTIVITY_LOG);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.appendFileSync(ACTIVITY_LOG, JSON.stringify(entry) + '\n');
  } catch (e) { /* ignore */ }
}

function updateRecentActivity(entries) {
  try {
    if (!fs.existsSync(RULES_CLAUDE_MD)) return;

    const content = fs.readFileSync(RULES_CLAUDE_MD, 'utf8');

    // Recent Activityセクションのみ更新
    const recent = entries.slice(-MAX_RECENT).reverse();
    const lines = recent.map(e => {
      const dt = new Date(e.timestamp).toLocaleString('ja-JP', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
      return `- ${dt} ${e.summary}`;
    });

    const activityBlock = lines.length > 0 ? lines.join('\n') : '*No recent activity*';

    // CRLF/LF 両対応
    const updated = content.replace(
      /(<claude-mem-context>[\s\S]*?# Recent Activity[\r\n]+)[\s\S]*?(<\/claude-mem-context>)/,
      `$1${activityBlock}\n$2`
    );

    if (updated !== content) {
      fs.writeFileSync(RULES_CLAUDE_MD, updated, 'utf8');
    }
  } catch (e) { /* ignore */ }
}

async function main() {
  try {
    const stdinData = await readStdin();
    let input = {};
    try { input = JSON.parse(stdinData); } catch { /* ignore */ }

    // セッションID（なければ日時ベース）
    const sessionId = input.session_id || `sess_${Date.now()}`;
    const timestamp = new Date().toISOString();

    // git から変更ファイルを取得
    const changedFiles = getGitActivity();

    // サマリー生成
    let summary = changedFiles
      ? `ファイル変更: ${changedFiles}`
      : '作業実施';

    // transcript_path があれば最後のassistantメッセージから要約を取れるが省略

    const entry = {
      timestamp,
      sessionId,
      summary,
      changedFiles: changedFiles ? changedFiles.split(', ') : []
    };

    // ログに追記
    appendActivityLog(entry);

    // Recent Activity を更新
    const allEntries = loadActivityLog();
    updateRecentActivity(allEntries);

    process.exit(0);
  } catch (e) {
    process.exit(0); // 常に0で終了（Claudeをブロックしない）
  }
}

main();
