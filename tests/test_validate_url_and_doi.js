/*
*/
const Zotero = require('../build/zotero-lib');
const fs = require('fs');
var request = require("request");

function getids(newlocation) {
  const res = newlocation.match(/^zotero\:\/\/select\/groups\/(library|\d+)\/(items|collections)\/([A-Z01-9]+)/);
  let x = {};
  if (res) {
    x.key = res[3];
    x.type = res[2];
    x.group = res[1];
  } else {
    x.key = newlocation;
  }
  return x;
};


async function main(coll) {
  const id = getids(coll);
  const zotero = new Zotero({ verbose: true, 'group-id': id.group });
  const items = await zotero.items({
    collection: id.key,
    top: true
  });
  let arr = items.map((i) => ({ key: i.key, doi: zotero.get_doi_from_item(i.data) }));

  // console.log('final=' + JSON.stringify(collections, null, 2));
  //  fs.writeFileSync("out_"+element.key + '.json', JSON.stringify(c, null, 2));
  // return {key: element.key, name: element.name, items: c.length};
  console.log('final=' + JSON.stringify(arr, null, 2));
  // write collections to file
  // arr.forEach((element) => {
  //console.log(element.key + '\t'+ element.doi);
  //});
  // url = 'https://doi.org/10.53832/opendeved.0266';
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].doi == "") {
      console.log("no_doi" + "\t" + arr[i].key  +"\t"+ "https://docs.opendeved.net/lib/" + arr[i].key + "\t" + arr[i].doi);
    } else {
      if (arr[i].doi.match(/opendeved/)) {
        const url = 'https://doi.org/' + arr[i].doi;
        // surround with try/catch
        try {
          await request({ url: url, followRedirect: true }, function (err, res, body) {
            try {
              const x = res.request.uri.href == url ? false : true;
              console.log("r:"+ x + "\t" + arr[i].key  +"\t"+ "https://docs.opendeved.net/lib/" + arr[i].key + "\t" + arr[i].doi + "\t" + res.request.uri.href);
            } catch (err) {
              console.log("error1" + "\t" + arr[i].key  +"\t"+ "https://docs.opendeved.net/lib/" + arr[i].key + "\t" + arr[i].doi);
            }
          });
        } catch (err) {
          console.log("error2" + "\t" + arr[i].key  +"\t"+ "https://docs.opendeved.net/lib/" + arr[i].key + "\t" + arr[i].doi);
        }
      } else {
        console.log("not_our_doi" + "\t" + arr[i].key  +"\t"+ "https://docs.opendeved.net/lib/" + arr[i].key + "\t" + arr[i].doi);
      }
    };
  };
};



var args = process.argv.slice(2);
main(args[0]);
