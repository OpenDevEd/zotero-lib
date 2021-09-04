export default function processExtraField(input = '') {
  let result = '';

  const lines = input.split('\n');
  /*
    if (lines.length > 0) {
    } else {
      return input
    } */
  console.log("pEF:" + lines.join("\n///"));
  let doiLines = lines.filter((line) => line.includes('DOI: '));
  if (doiLines.length > 0) {
    let firstDOI = doiLines[0];
    if (doiLines.length > 1) {
      doiLines = doiLines.slice(1, doiLines.length)
      // sort dois
      doiLines.sort();
      doiLines.reverse();
      console.log("pEF:00000>" + doiLines.join("\n"));
      // prefix older DOIs with previous
      doiLines = doiLines.map((doi, index) => {
        /* if (index === 0) {
          const [, lastPart] = doi.split(' ');
          return 'DOI: ' + lastPart;
        }
        if (index > 0 && !doi.startsWith('previous')) { */
        if (!doi.startsWith('previous')) {
          return 'previous' + doi;
        }
        return doi;
      });
      doiLines = [firstDOI, ...doiLines]
    } else {
      doiLines = [firstDOI]
    }
  }
  let nonDOILines = lines.filter(
    (line) => !(line.startsWith('DOI: ') || line.startsWith('previousDOI: '))
  );

  const kerkoLinePrefix = 'KerkoCite.ItemAlsoKnownAs:';
  let kerkoLine = nonDOILines.find((line) => line.startsWith(kerkoLinePrefix));

  nonDOILines = nonDOILines.filter((line) => !line.startsWith(kerkoLinePrefix));
  // if line not exist add it
  if (!kerkoLine) {
    kerkoLine = kerkoLinePrefix;
  }
  // split with " " and ingore first element which will be prefix
  let [, ...kerkoItems] = kerkoLine.split(' ');

  // add sorted doi
  kerkoItems = [
    ...new Set(
      doiLines
        .map((line) => {
          const [, doi] = line.split(' ');
          return doi;
        })
        .concat(kerkoItems)
    ),
  ];

  kerkoLine = '';
  if (kerkoItems.length > 0) {
    kerkoItems = [kerkoLinePrefix, ...kerkoItems];
    kerkoLine = kerkoItems.join(' ');
  }

  // combine doi + kerkoLine + anything else as result separate by newline
  result = [...doiLines, kerkoLine, ...nonDOILines].join('\n');
  return result;
}

// module.exports = processExtraField;
