import { existsSync } from 'fs';
import { stat, unlink, writeFile } from 'fs/promises';

/**
 * Check for a valid lock file, if it exists and is within the lockTimeout
 * @param lockfile - path to the lock file
 * @param lockTimeout - time in seconds that the lock file is valid
 * @returns boolean
 */
export async function checkForValidLockFile(lockfile: string, lockTimeout: number | string) {
  const threshold = Date.now() - Number(lockTimeout) * 1000;
  if (!existsSync(lockfile)) {
    console.log('no lock file found');
    await createLockFile(lockfile);
    return false;
  }

  const hasValidLockFile = stat(lockfile).then((filestats) => threshold < filestats.mtimeMs);

  if (!hasValidLockFile) {
    await removeLockFile(lockfile);
  }

  return hasValidLockFile;
}

/**
 * Create a lock file
 * @param lockfile - path to the lock file
 */
export function createLockFile(lockfile: string) {
  console.log('creating lock file');
  return writeFile(lockfile, String(Date.now()));
}

/**
 * Remove a lock file
 * @param lockfile - path to the lock file
 */
export function removeLockFile(lockfile: string) {
  console.log('removing lock file');
  return unlink(lockfile);
}
