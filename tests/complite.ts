import Zotero from '../src/zotero-lib';
// interface Item {
//   [key: string]: string;
// }

// interface CrossRefResponse {
//   message: {
//     [key: string]: string;
//   };
// }

const itemKey = 'TEACS38K';
//@ts-ignore
const zotero = new Zotero({ 'group-id': '2129771', verbose: false });

(async () => {
  let item = await zotero.item({ key: itemKey, verbose: false });
  console.log(item.extra.split('\n'));
  let doi = item.extra.split('\n').filter(i => i.includes('DOI'));
  console.log(doi);
})();

// const itemJSON = itemOutput.replace(/^[^{]+/, '');
// const item: Item = JSON.parse(itemJSON);

// const doi = item['DOI'];

// check if it's has DOI
// if yes create a get req to this end point
// https://api.crossref.org/swagger-ui/index.html#/Works/get_works__doi_
// https://doi.org/10.53832/opendeved.0286
// https://api.crossref.org/works/https://doi.org/10.53832/opendeved.0286
// const xOutput = execSync(`wget https://api.crossref.org/works/${doi} -O - -q`).toString();
// const xJSON = JSON.parse(xOutput);
// const x: CrossRefResponse = JSON.parse(xJSON);

// const k: { [key: string]: string } = {
//   volume: 'volume',
//   issue: 'issue',
//   pages: 'page',
//   journalAbbreviation: 'short-container-title',
//   publicationTitle: 'container-title',
//   url: 'URL',
// };

// const fields: string[] = [];

// for (const key in k) {
//   const source = item[key];
//   const target = x.message[k[key]];
//   if (source === '' && target !== null) {
//     console.log(`${key}: ${source} -> ${target}`);
//     fields.push(`"${key}": "${target}"`);
//   }
// }

// if (fields.length > 0) {
//   const fieldsJSON = `{${fields.join(',')}}`;
//   const str = `zotero-cli update --key ${itemKey} --json '${fieldsJSON}'`;
//   console.log(str);
//   execSync(str);
// }
