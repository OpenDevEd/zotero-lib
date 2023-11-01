const he = require('he');

export function as_value(value) {
  if (Array.isArray(value)) {
    value = value[0];
  }
  return value;
}

export function as_array(value) {
  let result = [];
  if (value === undefined) {
    return value;
  }
  if (value) {
    if (!Array.isArray(value)) {
      result = [value];
    } else {
      result = value;
    }
  }
  return result;
}

export function catchme(number, text, error, data) {
  return JSON.stringify(
    {
      status: number,
      message: isomessage(text),
      error: error.toString(),
      data,
    },
    null,
    2,
  );
}

export function isomessage(text) {
  var d = new Date();
  var n = d.toISOString();
  return text + '; on ' + n;
}

export function getCanonicalURL(args, element) {
  let url = '';
  url =
    element.data.url != '' && !element.bib.match(element.data.url)
      ? ` Available from <a href="${he.encode(element.data.url)}">${he.encode(element.data.url)}</a>.`
      : '';
  url = element.data.url.match(/docs.edtechhub.org|docs.opendeved.net/)
    ? ' (' + urlify(element.data.url, element.library.id, element.key, args.zgroup, args.zkey, args.openinzotero) + ')'
    : url;
  return url;
}

export function urlify(details, elementLibraryId, elementKey, argsZGroup, argsZKey, argsOpenInZotero) {
  return `<a href="https://ref.opendeved.net/zo/zg/${elementLibraryId}/7/${elementKey}/NA?${
    argsZGroup || argsZKey ? `src=${argsZGroup}:${argsZKey}&` : ''
  }${argsOpenInZotero ? 'openin=zotero' : ''}">${details}</a>`;
}

export function colophon(string) {
  let result = '';
  const match = string.match(/Colophon: (.*?)\n/);
  if (match) {
    result = ' ' + match[1];
  }
  return result;
}
