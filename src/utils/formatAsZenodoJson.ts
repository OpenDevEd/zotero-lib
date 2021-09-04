import logger from "../logger";

const fs = require('fs');
const os = require('os');
const Sugar = require('sugar');

/*type Creator =
  | { name: string; creatorType: string }
  | { firstName: string; lastName: string; creatorType: string };
  */
interface ZoteroItem {
  creators?: [];
  rights: any;
  title: string;
  url: string;
  doi: string;
  extra: string;
  callNumber: string;
  institution: string;
  abstractNote: string;
  date: string;
}

// TODO: complete
function zenodoParseIDFromZoteroRecord(item) {
  logger.info('item = %O', item);
  const extra = item.extra.split('\n');
  // let doi = '';
  let id = '';
  extra.forEach((element) => {
    let res = element.match(/^\s*doi:\s*(.*?(\d+))$/i);
    if (res) {
      // doi = res[1];
      id = res[2];
    }
  });

  if (id.length === 0) {
    console.log('not found id in doi, searching in archive');
    const archiveLine = extra.find((line) =>
      line.startsWith('Archive: https://zenodo.org/record/')
    );

    if (archiveLine) {
      const parts = archiveLine.split('/');
      id = parts[parts.length - 1];
      console.log(`found id = ${id} from archiveLine ${archiveLine}`);
    }
  }

  console.log('parsedIdFromZoteroRecord: ', id);
  return id;
}


export default async function formatAsZenodoJson(item: ZoteroItem = {} as ZoteroItem, args: any) {
  // const { creators = [] } = item;

  const authorDataIn: string = [
    args.author_data,
    'author-data.json',
    `${os.homedir()}/.config/zotero-cli/author-data.json`,
  ].find((cfg) => fs.existsSync(cfg));
  const authorData = authorDataIn ? JSON.parse(fs.readFileSync(authorDataIn, 'utf-8')) : {};
  // console.log("TEMPORARY="+JSON.stringify(   crossRefUser         ,null,2))
  // TODO: should expand authordata to include aliases
  /*
  const authorData = {
    "Björn Haßler": {
      orcid: "https://orcid.org/0000-0002-5277-9947",
      organization: "OpenDevEd",
      aliases: ["Haßler, Björn"]                                                                                                                                               
    }
  }
  */
  // Should convert more items. https://developers.zenodo.org/#representation
  const zenodoID = zenodoParseIDFromZoteroRecord(item)
  let updateDoc = {
    id: zenodoID,
    title: item.title,
    description: item.abstractNote,
    authors: [],
    publication_date: ""
  };

  if (Array.isArray(item.creators) && item.creators.length) {
    logger.info('adding name from zotero');
    updateDoc.authors = item.creators.map(
      function (c) {
        const fullname = c["name"] ? c["name"] : `${c["lastName"]}, ${c["firstName"]} `;
        let res = {
          name: fullname
        }
        if (fullname in authorData) {
          if ("orcid" in authorData[fullname])
            res["orcid"] = authorData[fullname]["orcid"]
          if ("organization" in authorData[fullname])
            res["affiliation"] = authorData[fullname]["organization"]
        }
        return res
      });
  }
  if (item.date) {
    updateDoc["publication_date"] = item.date;
  }

  //    const today = Sugar.Date.format(new Date(), '%Y%m%d%H%M%S') + "000"; // "[THEDATE]" // new Date().toDateString('DD-MMM-YYYY')  

  const extra = item.extra;
  let doi = ""
  if ('doi' in item) {
    doi = item.doi;
    console.log(`DOI from item.doi: ${doi}`)
  } else {
    extra.split('\n').forEach((element) => {
      var mymatch = element.match(/^DOI\:\s*(.*?)\s*$/);
      if (mymatch) {
        doi = mymatch[1];
      }
    });
    if (doi) { console.log(`DOI from item.extra: ${doi}`) }
  }

  //const url = item.url
  //const institution = item.institution
  // console.log("TEMPORARY="+JSON.stringify(   item         ,null,2))

  let itemdate = item.date;
  const match = item.date.match(/(\d\d?)\/(\d\d?)\/(\d\d\d\d)/)
  if (match) {
    itemdate = match[3] + "-" + match[2] + "-" + match[1]
  }
  logger.info("DATE: " + itemdate)
  try {
    itemdate = Sugar.Date.create(itemdate)
  } catch (error) {
    itemdate = Sugar.Date.format(new Date(), '%Y-%m-%d')
  }

  await fs.writeFile("updateDoc.json", JSON.stringify(updateDoc), 'utf-8', function (err) {
    if (err) console.log(err);
  })
  return updateDoc;
}

