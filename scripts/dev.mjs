import { spawn, execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { createConnection } from 'node:net';

const args = process.argv.slice(2).filter(a => a !== '--strictPort')
  .map(a => a === '--host' ? '--hostname' : a);
const port = Number(process.env.DASHBOARD_PORT || 8100);
const database = process.env.DASHBOARD_DB || join(homedir(), '.aura-volt', 'catalogue.sqlite');
execFileSync('python3', ['scripts/storefront.py'], { stdio: 'inherit' });
const watcher = spawn('python3', ['scripts/storefront.py', '--watch'], { stdio: 'inherit' });
let admin;
const next = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'dev', ...args], { stdio: 'inherit' });

if (!process.env.DASHBOARD_ORIGIN && (process.env.DATABASE_URL || existsSync(database))) {
  const probe = createConnection({ host: '127.0.0.1', port });
  probe.once('connect', () => probe.end());
  probe.once('error', error => {
    if (error.code !== 'ECONNREFUSED' || next.exitCode !== null || next.killed) return;
    admin = spawn('python3', ['dashboard/manage.py', 'serve'], {
      stdio: 'inherit',
      env: { ...process.env, DASHBOARD_ORIGIN: `http://127.0.0.1:${port}` },
    });
    admin.on('error', err => console.error('Démarrage du dashboard impossible.', err.message));
  });
} else if (!process.env.DASHBOARD_ORIGIN) {
  console.info('Premier accès au dashboard : python3 dashboard/manage.py init --demo puis python3 dashboard/manage.py create-admin');
}

for (const signal of ['SIGTERM','SIGINT']) {
  process.on(signal, () => { next.kill(signal); admin?.kill(signal); watcher.kill(signal); });
}
next.on('exit', code => { admin?.kill(); watcher.kill(); process.exit(code ?? 1); });
