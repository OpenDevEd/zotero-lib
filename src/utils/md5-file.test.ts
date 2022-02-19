const fs = require('fs');
import md5File from './md5-file';

describe('md5-file', () => {
  const testFileName = 'md5-test.txt';
  const knownString = 'this is test string for md5 tests';
  const knownMD5 = '52248116991233c77bd8a32fffeadd6b';

  beforeEach(() => {
    if (!fs.existsSync(testFileName)) {
      fs.writeFileSync(testFileName, knownString);
    }
  });

  test('it should take a filename and contain md5 hash', () => {
    const result = md5File(testFileName);
    expect(result).toBe(knownMD5);
  });

  afterEach(() => {
    fs.unlink(testFileName, (err) => {
      if (err) throw err;
    });
  });
});
