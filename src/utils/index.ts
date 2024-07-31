import { ZoteroTypes } from '../zotero-interface';

const he = require('he');

export function as_value(value: any): any {
  if (Array.isArray(value)) {
    value = value[0];
  }
  return value;
}

export function as_array(value: any): any {
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

export function catchme(number: number, text: string, error: any, data: any) {
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

export function isomessage(text: string) {
  var d = new Date();
  var n = d.toISOString();
  return text + '; on ' + n;
}
type CanonicalUrlElement = {
  data: { url: string };
  bib: string;
  library: { id: any };
  key: any;
};

export function getCanonicalURL(args: ZoteroTypes.IGetZoteroDataXargs, element: CanonicalUrlElement) {
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

export function urlify(
  details: string,
  elementLibraryId: string,
  elementKey: string,
  argsZGroup: string,
  argsZKey: string,
  argsOpenInZotero: boolean,
): string {
  return `<a href="https://ref.opendeved.net/zo/zg/${elementLibraryId}/7/${elementKey}/NA?${
    argsZGroup || argsZKey ? `src=${argsZGroup}:${argsZKey}&` : ''
  }${argsOpenInZotero ? 'openin=zotero' : ''}">${details}</a>`;
}

export function colophon(string: string): string {
  let result = '';
  const match = string.match(/Colophon: (.*?)\n/);
  if (match) {
    result = ' ' + match[1];
  }
  return result;
}
