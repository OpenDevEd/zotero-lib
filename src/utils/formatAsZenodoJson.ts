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

// TODO: complete: This needs to check for multiple DOI locations: item.doi and then extra.
// It then needs to check whether this is a zenodo doi.
// Also, we need a new "zenodoRecord: 123" and "zenodoConcept: 123"
function zenodoParseIDFromZoteroRecord(item) {
  logger.info('item = %O', item);
  const extra = item.extra.split('\n');
  // let doi = '';
  let id = '';
/*  extra.forEach((element) => {
    let res = element.match(/^\s*doi:\s*(.*?(\d+))$/i);
    if (res) {
      // doi = res[1];
      id = res[1];
    }
  }); */
  let candidate = '';
  extra.forEach((element) => {
    console.log(element);
    let res = element.match(
      /^\s*(doi:\s*10\.5281\/zenodo\.|previousDOI:\s*10\.5281\/zenodo\.|ZenodoArchiveID:\s*|Archive: https:\/\/zenodo.org\/record\/)(\d+)\s*$/i
    );
    if (res) {
      // doi = res[1];
      candidate = res[2];
      //console.log("?? " + candidate)
      if (parseInt(id) < parseInt(candidate)) {
        id = candidate;
        //console.log("-- " + candidate)
      }
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

export default async function formatAsZenodoJson(
  item: ZoteroItem = {} as ZoteroItem,
  args: any,
): Promise<{
  id: string;
  title: string;
  description: string;
  authors: any[];
  publication_date: string;
}> {
  // const { creators = [] } = item;
  logger.info('formatAsZenodoJson');

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
    description: item.abstractNote ? item.abstractNote : "[No description available.]",
    authors: [],
    publication_date: ""
  };
  // logger.info("formatAsZenodoJson updateDoc=" + JSON.stringify(updateDoc, null, 2))
  // logger.info("formatAsZenodoJson authorData=" + JSON.stringify(authorData, null, 2))
  let authorDataExpanded = {}
  for (const key in authorData) {
    authorDataExpanded[key] = authorData[key]
    for (const variation in authorData[key].aliases) {
      authorDataExpanded[authorData[key].aliases[variation]] = authorData[key]
    }
  }
  // logger.info("formatAsZenodoJson authorDataExpanded=" + JSON.stringify(authorDataExpanded, null, 2))

  if (Array.isArray(item.creators) && item.creators.length) {
    // logger.info('formatAsZenodoJson: adding name from zotero');
    updateDoc.authors = item.creators.map(
      function (c) {
        const fullname = c["name"] ? c["name"] : `${c["lastName"]}, ${c["firstName"]}`;
        let res = {
          name: fullname
        }
        if (fullname in authorDataExpanded) {
          if ("orcid" in authorDataExpanded[fullname])
            res["orcid"] = authorDataExpanded[fullname]["orcid"]
          if ("organization" in authorDataExpanded[fullname])
            res["affiliation"] = authorDataExpanded[fullname]["organization"]
        }
        return res
      });
  }


  //    const today = Sugar.Date.format(new Date(), '%Y%m%d%H%M%S') + "000"; // "[THEDATE]" // new Date().toDateString('DD-MMM-YYYY')  

  const extra = item.extra;
  let doi = ""
  if ('doi' in item) {
    doi = item.doi;
    logger.info(`formatAsZenodoJson: DOI from item.doi: ${doi}`)
  } else {
    extra.split('\n').forEach((element) => {
      var mymatch = element.match(/^DOI\:\s*(.*?)\s*$/);
      if (mymatch) {
        doi = mymatch[1];
      }
    });
    if (doi) { console.log(`formatAsZenodoJson: DOI from item.extra: ${doi}`) }
    updateDoc["doi"] = doi
  }

  updateDoc["upload_type"] = "publication"
  updateDoc["publication_type"] = "report"

  // We should sort out the licence too
  /*
  updateDoc["access_right"] = "open"
  updateDoc["license"] = "..."
  */
  //const url = item.url
  //const institution = item.institution
  // console.log("TEMPORARY="+JSON.stringify(   item         ,null,2))
  /*
  updateDoc["related_identifiers"] ... zotero://
  */
  // references
  // communities
  // language

  Sugar.Date.setLocale('en-GB');
  //Sugar.Date.getLocale('en').addFormat('{day}/{month}/{year}');
  // console.log("isodate: "+mydate);
  const now = new Sugar.Date.create(item.date);
  // console.log("isodate: "+now);
  const isodate = Sugar.Date.format(now, "ISO8601")

  /* let itemdate = item.date;
  const match = item.date.match(/(\d\d?)\/(\d\d?)\/(\d\d\d\d)/)
  if (match) {
    itemdate = match[3] + "-" + match[2] + "-" + match[1]
  }
  logger.info("DATE: " + itemdate)
  try {
    itemdate = Sugar.Date.create(itemdate)
  } catch (error) {
    itemdate = Sugar.Date.format(new Date(), '%Y-%m-%d')
  } */

  updateDoc["publication_date"] = isodate;
  // logger.info("formatAsZenodoJson updateDoc=" + JSON.stringify(updateDoc, null, 2))

  return updateDoc;
}

