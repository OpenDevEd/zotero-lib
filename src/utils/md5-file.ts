const fs = require('fs');
const crypto = require('crypto');

/**
 * Calculates the MD5 hash of a file
 * @param filename - the filename of file to hash
 * @returns - The MD5 hash of input file
 */
export default function md5File(filename = ''): string {
  if (fs.existsSync(filename)) {
    return md5(fs.readFileSync(filename));
  }
  return '';
}

/**
 * Calculates the MD5 hash of a string.
 *
 * @param  {String} input - The string (or buffer).
 * @return {String}        - The MD5 hash.
 */
export function md5(input: string): string {
  return crypto.createHash('md5').update(input).digest('hex');
}
