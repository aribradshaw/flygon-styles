#!/usr/bin/env node
// Open a pull request in every repo that installs an older @flygon/styles.
//
//   npm run bump-consumers -- [--version 1.0.5] [--owner aribradshaw] [--repo flow] [--dry-run]
//
// Finds consumers by scanning each repo's package.json files for the release
// tarball URL (GitHub code search lags behind new commits, so it is not
// trusted alone). For each package.json on an older version it rewrites the
// URL, runs `npm install` there to refresh the lockfile, then runs that
// package's `styles:after-bump` script if it defines one (use it to rebuild
// generated output, e.g. SongBrain's styles:sync or Flygon LC's published
// pages). Changes land on branch chore/flygon-styles-<version> as one PR per
// repo. Needs: gh (logged in), git, npm. Scratch clones go under
// ~/scratch/flygon-styles-bump, never /tmp.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';

const args = process.argv.slice(2);
const flag = name => args.includes(`--${name}`);
const option = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? fallback : args[index + 1];
};
const owner = option('owner', 'aribradshaw');
const onlyRepo = option('repo', null);
const dryRun = flag('dry-run');
const self = 'flygon-styles';

const run = (command, commandArgs, options = {}) =>
  execFileSync(command, commandArgs, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...options }).trim();
const gh = (...ghArgs) => run('gh', ghArgs);

const version = option('version', null)
  || gh('release', 'view', '--repo', `${owner}/${self}`, '--json', 'tagName', '-q', '.tagName').replace(/^v/, '');
if (!/^\d+\.\d+\.\d+$/.test(version)) throw new Error(`Not a release version: ${version}`);
const tarball = `https://github.com/${owner}/${self}/releases/download/v${version}/${self}-${version}.tgz`;
const urlPattern = new RegExp(`https://github\\.com/${owner}/${self}/releases/download/v(\\d+\\.\\d+\\.\\d+)/${self}-\\1\\.tgz`, 'g');
const compare = (a, b) => {
  const [x, y] = [a, b].map(v => v.split('.').map(Number));
  return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
};

function packageFiles(repo) {
  let tree;
  try {
    tree = JSON.parse(gh('api', `repos/${owner}/${repo}/git/trees/HEAD?recursive=1`));
  } catch {
    return []; // empty repo
  }
  return tree.tree
    .filter(entry => entry.type === 'blob' && /(^|\/)package\.json$/.test(entry.path) && !/(^|\/)node_modules\//.test(entry.path))
    .map(entry => entry.path);
}

function readRemote(repo, path) {
  return gh('api', `repos/${owner}/${repo}/contents/${path}`, '-H', 'Accept: application/vnd.github.raw');
}

const repos = onlyRepo
  ? [onlyRepo]
  : JSON.parse(gh('repo', 'list', owner, '--limit', '500', '--no-archived', '--source', '--json', 'name')).map(r => r.name);

const plan = [];
for (const repo of repos.filter(name => name !== self)) {
  const stale = [];
  for (const path of packageFiles(repo)) {
    const text = readRemote(repo, path);
    const found = [...text.matchAll(urlPattern)].map(match => match[1]);
    if (found.some(v => compare(v, version) < 0)) stale.push({ path, from: [...new Set(found)].join(', ') });
  }
  if (stale.length) plan.push({ repo, stale });
}

if (!plan.length) {
  console.log(`Every consumer is on ${version} or newer.`);
  process.exit(0);
}
for (const { repo, stale } of plan) {
  for (const { path, from } of stale) console.log(`${repo}: ${path} ${from} -> ${version}`);
}
if (dryRun) process.exit(0);

const scratch = join(homedir(), 'scratch', 'flygon-styles-bump');
mkdirSync(scratch, { recursive: true });
const branch = `chore/flygon-styles-${version}`;
// Commit as the GitHub no-reply address so personal email never lands in public repos.
const me = JSON.parse(gh('api', 'user'));
const identity = ['-c', `user.name=${me.name || me.login}`, '-c', `user.email=${me.id}+${me.login}@users.noreply.github.com`];
const results = [];

for (const { repo, stale } of plan) {
  const dir = join(scratch, repo);
  rmSync(dir, { recursive: true, force: true });
  try {
    run('gh', ['repo', 'clone', `${owner}/${repo}`, dir, '--', '--depth', '1', '--quiet']);
    if (run('git', ['ls-remote', '--heads', 'origin', branch], { cwd: dir })) {
      results.push(`${repo}: skipped, ${branch} already exists`);
      continue;
    }
    run('git', ['checkout', '-q', '-b', branch], { cwd: dir });
    for (const { path } of stale) {
      const file = join(dir, path);
      writeFileSync(file, readFileSync(file, 'utf8').replace(urlPattern, tarball));
      const packageDir = dirname(file);
      run('npm', ['install', '--no-audit', '--no-fund', '--ignore-scripts'], { cwd: packageDir, stdio: 'inherit' });
      const scripts = JSON.parse(readFileSync(file, 'utf8')).scripts || {};
      if (scripts['styles:after-bump']) run('npm', ['run', 'styles:after-bump'], { cwd: packageDir, stdio: 'inherit' });
    }
    run('git', ['add', '-A'], { cwd: dir });
    const paths = stale.map(s => s.path).join(', ');
    run('git', [...identity, 'commit', '-q', '-m', `Use @flygon/styles ${version}\n\nBumps ${paths} to the ${version} release tarball and refreshes lockfiles. Release notes: https://github.com/${owner}/${self}/releases/tag/v${version}`], { cwd: dir });
    run('git', ['push', '-q', '-u', 'origin', branch], { cwd: dir });
    const base = run('gh', ['repo', 'view', `${owner}/${repo}`, '--json', 'defaultBranchRef', '-q', '.defaultBranchRef.name']);
    const url = run('gh', ['pr', 'create', '--repo', `${owner}/${repo}`, '--base', base, '--head', branch, '--fill'], { cwd: dir });
    results.push(`${repo}: ${url}`);
  } catch (error) {
    results.push(`${repo}: FAILED ${String(error.stderr || error.message).split('\n')[0]}`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}
console.log(results.join('\n'));
if (results.some(line => line.includes('FAILED'))) process.exitCode = 1;
