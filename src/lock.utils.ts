import { existsSync } from 'fs';
import { stat, unlink, writeFile } from 'fs/promises';

export async function checkForValidLockFile(lockfile, lockTimeout) {
  const threshold = Date.now() - Number(lockTimeout) * 1000;
  if (!existsSync(lockfile)) {
    console.log('no lock file found');
    await createLockFile(lockfile);
    return false;
  }

  const hasValidLockFile = stat(lockfile).then(filestats => threshold < filestats.mtimeMs);

  if (!hasValidLockFile) {
    await removeLockFile(lockfile);
  }

  return hasValidLockFile;
}

export function createLockFile(lockfile) {
  console.log('creating lock file');
  return writeFile(lockfile, String(Date.now()));
}

export function removeLockFile(lockfile) {
  console.log('removing lock file');
  return unlink(lockfile);
}
