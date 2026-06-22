#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const isYes = args.includes('--yes') || args.includes('-y');

const brainDir = __dirname;
const skillDest = path.join(
  process.env.HOME || process.env.USERPROFILE,
  '.config', 'opencode', 'skills', 'brain', 'SKILL.md'
);

function run(cmd, opts = {}) {
  console.log(`  $ ${cmd}`);
  if (!isDryRun) execSync(cmd, { cwd: brainDir, stdio: 'inherit', ...opts });
}

function confirm(prompt) {
  if (isYes) return true;
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    rl.question(`${prompt} (Y/n) `, answer => {
      rl.close();
      resolve(answer.toLowerCase() !== 'n');
    });
  });
}

async function main() {
  console.log(`
╔══════════════════════════════════════════╗
║  Brain subagent installer                ║
║  for opencode                            ║
╚══════════════════════════════════════════╝
`);
  console.log('Will do:');
  console.log('  1. npm install     — download pdfkit (79 packages)');
  console.log('  2. npm link --force — make gemini-pdf globally available');
  console.log('  3. Copy SKILL.md   →', skillDest);
  console.log();

  if (isDryRun) {
    console.log('Dry-run. No changes made.\n');
    process.exit(0);
  }

  if (!(await confirm('Proceed?'))) {
    console.log('Aborted.\n');
    process.exit(0);
  }

  console.log();
  run('npm install');
  console.log();
  run('npm link --force');
  console.log();

  console.log('Copying SKILL.md...');
  fs.mkdirSync(path.dirname(skillDest), { recursive: true });
  fs.copyFileSync(path.join(brainDir, '.opencode', 'skills', 'brain', 'SKILL.md'), skillDest);

  console.log(`
╔══════════════════════════════════════════╗
║  Done!                                   ║
║                                          ║
║  Brain installed globally:               ║
║    ${skillDest}           ║
║                                          ║
║  Use @brain <topic> in any project.      ║
╚══════════════════════════════════════════╝
`);
}

main().catch(err => {
  console.error('Install failed:', err.message);
  process.exit(1);
});
