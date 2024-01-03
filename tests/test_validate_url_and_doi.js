/*
*/
const Zotero = require('../build/zotero-lib');
const fs = require('fs');
var request = require("request");
const curl = require('sync-request-curl');
// const crossref = require('../build/utils/formatAsCrossRefXML');

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


function logger(message, key, doi, url, title) {
  console.log(message + "\t" + key + "\t" + "https://docs.opendeved.net/lib/" + key + "\t" + doi + "\t" + url + "\t" + title);
};


async function main(coll) {
  const id = getids(coll);
  const zotero = new Zotero({ verbose: true, 'group-id': id.group });
  const items = await zotero.items({
    collection: id.key,
    top: true
  });
  let arr = items.map((i) => ({ key: i.key, doi: zotero.get_doi_from_item(i.data), title: i.data.title, data: i.data }));

  // console.log('final=' + JSON.stringify(collections, null, 2));
  //  fs.writeFileSync("out_"+element.key + '.json', JSON.stringify(c, null, 2));
  // return {key: element.key, name: element.name, items: c.length};
  // console.log('final=' + JSON.stringify(arr, null, 2));
  // write collections to file
  // arr.forEach((element) => {
  //console.log(element.key + '\t'+ element.doi);
  //});
  // url = 'https://doi.org/10.53832/opendeved.0266';
  for (let i = 0; i < arr.length; i++) {
    let result;
    if (arr[i].doi == "") {
      logger("no_doi", arr[i].key, arr[i].doi, "", arr[i].title);
      result = "no_doi";
    } else {
      if (arr[i].doi.match(/opendeved/)) {
        const url = 'https://doi.org/' + arr[i].doi;
        // surround with try/catch
        try {
          // console.log(url);
          const response = curl('GET', url);
          // console.log('Status Code:', response.statusCode);
          //console.log('body:', response.body.toString());
          //console.log('h:', response.headers.location ? response.headers.location : "");
          //console.log('json:', JSON.parse(response.body.toString()));
          logger("r:" + response.statusCode, arr[i].key, arr[i].doi, response.headers.location ? response.headers.location : "", arr[i].title);
          if (arr[i].title.match(/^\w/)) {
            result = response.headers.location ? "ok" : "activate";
          } else {
            result = "dummy";
          }
          /*
          result = await request({ url: url, followRedirect: true }, function (err, res, body) {
            try {
              const x = res.request.uri.href == url ? false : true;              
              logger("r:" + x, arr[i].key, arr[i].doi, res.request.uri.href, arr[i].title);              
              if (!x) {
                if (arr[i].title.match(/^\w/)) {
                  return "activate";  
                } else {
                  return "1";
                }
              } else {
                return "1";
              }
            } catch (err) {
              logger("error1", arr[i].key, arr[i].doi, "", arr[i].title);
              return "1";
            }
          });
          */
        } catch (err) {
          logger("error2", arr[i].key, arr[i].doi, "", arr[i].title);
          result = "error2";
        }
      } else {
        logger("not_our_doi", arr[i].key, arr[i].doi, "", arr[i].title);
        result = "not_our_doi";
      }
    };
    // console.log("->" + JSON.stringify(result) + "\t" + arr[i].key);
    if (result == "activate") {
      console.log("activate " + arr[i].key);
      /* await crossref.formatAsCrossRefXML(
        arr[i].data,
        {
          crossref: true,
          crossref_submit: true,
        }); */
      //process.exit(0);
    };
  };
};



var args = process.argv.slice(2);
main(args[0]);
