const fs = require('fs');
const os = require('os');

export default function newVanityDOI(item, group_id, crossref_user) {
  let doi = '';
  if (item.data.callNumber && item.data.callNumber != '') {
    const crossRefUserIn: string = [
      crossref_user,
      'crossref-user.json',
      `${os.homedir()}/.config/zotero-cli/crossref-user.json`,
    ].find((cfg) => fs.existsSync(cfg));
    const crossRefUser = crossRefUserIn ? JSON.parse(fs.readFileSync(crossRefUserIn, 'utf-8')) : {};
    // console.log("TEMPORARY="+JSON.stringify(     args       ,null,2))
    if (crossRefUser.doi_prefix && crossRefUser.doi_string_library[group_id]) {
      doi = `${crossRefUser.doi_prefix}/${crossRefUser.doi_string_library[group_id]}${item.data.callNumber}`;
    }
  }
  console.log('TEMPORARY=' + JSON.stringify(doi, null, 2));

  return doi;
}
