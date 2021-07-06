const stream = require('stream');
const { promisify } = require('util');
const { createWriteStream } = require('fs');
const axios = require('axios');

const finished = promisify(stream.finished);

async function downloadFile(fileUrl, outputLocationPath) {
  const writer = createWriteStream(outputLocationPath);
  return axios({
    method: 'get',
    url: fileUrl,
    responseType: 'stream',
  }).then(async (response) => {
    response.data.pipe(writer);
    return finished(writer);
  });
}

module.exports = downloadFile;
