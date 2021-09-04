import logger from "../logger";

const fs = require('fs');
const os = require('os');
const Sugar = require('sugar');
const xmlescape = require('xml-escape');

type Creator =
  | { name: string; creatorType: string }
  | { firstName: string; lastName: string; creatorType: string };
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


/*
            parser_item.add_argument('--crossref-user', {
      });
      parser_item.add_argument('--crossref-submit', {
        action: 'store',
        help: `Supply a json file with user password for crossref: {password: "..."}. If --crossref is specified without --crossref-user, default settings in your configuration directory are checked: ~/.config/zotero-cli/crossref-password.json. This operation effectively runs curl -F 'operation=doMDUpload'  -F 'login_id=.../...' -F 'login_passwd=...' -F 'fname=@data.xml' https://doi.crossref.org/servlet/deposit`
      });
      // Not implemented:      
      parser_item.add_argument('--zenodo', {
        action: 'store_true',
        help: 'Provide output in zenodo json format.',
      });
      
      The processing for authordata options in zotzen-lib is basic - need to check what we have in zenodo-lib. However, it might make sense to get Zotero to produce the required json for Zenodo.
      See 370755a6-0cfd-11ec-851b-77cdfd2128b9 in zotzen-lib
    
      // Not implemented:
      parser_item.add_argument('--author-data', {
        action: 'store',
        help: 'Supply a json file with authors database, enabling extra author information to be added for crossref. If --crossref or --zenodo are specified without --author-data, default settings in your configuration director are checked: ~/.config/zotero-cli/author-data.json',
      });

      */

export default async function formatAsCrossRefXML(item: ZoteroItem = {} as ZoteroItem, args: any) {
  const { creators = [] } = item;

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

  let seq = "first"
  const creatorsList = creators
    .map((c: Creator) => {
      let person = ""
      let orcid = ""
      let org = ""
      const fullname = 'name' in c ? c.name : `${c.firstName} ${c.lastName}`;
      if (fullname in authorData) {
        if (authorData[fullname]["orcid"]) {
          orcid = `<ORCID>${authorData[fullname]["orcid"]}</ORCID>`;
        }
        if (authorData[fullname]["organization"]) {
          org = `<organization sequence='${seq}' contributor_role='${c.creatorType}'>${authorData[fullname]["organization"]}</organization>`;
        }
      }
      if ('name' in c) {
        person = `<person_name sequence='${seq}' contributor_role='${c.creatorType}'>
      <given_name>${c.name}</given_name>
      <surname>${c.name}</surname>${orcid}
</person_name>${org}`;
      } else {
        person = `<person_name sequence='${seq}' contributor_role='${c.creatorType}'>
      <given_name>${c.firstName}</given_name>
      <surname>${c.lastName}</surname>${orcid}
</person_name>${org}`
      }
      seq = "additional"
      return person
    })
    .join('\n');
  // <ORCID>https://orcid.org/...</ORCID>

  const today = Sugar.Date.format(new Date(), '%Y%m%d%H%M%S') + "000"; // "[THEDATE]" // new Date().toDateString('DD-MMM-YYYY')
  //const ModifyDate = today;
  const CreateDate = today;
  //const MetadataDate = today;
  //const DocumentID = '';
  //const InstanceID = '';
  //const keywords = '';
  //const Producer = '';

  // help: 'Supply a json file with user data for crossref: {depositor_name: "user@domain:role", email_address: "user@domain"}. If --crossref is specified without --crossref-user, default settings in your configuration directory are checked: ~/.config/zotero-cli/crossref-user.json',
  const crossRefUserIn: string = [
    args.crossref_user,
    'crossref-user.json',
    `${os.homedir()}/.config/zotero-cli/crossref-user.json`,
  ].find((cfg) => fs.existsSync(cfg));
  const crossRefUser = crossRefUserIn ? JSON.parse(fs.readFileSync(crossRefUserIn, 'utf-8')) : { depositor_name: "NAME:ROLE", email_address: "EMAIL" };
  // console.log("TEMPORARY="+JSON.stringify(   crossRefUser         ,null,2))

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
  /*
  if (!doi && item.callNumber != "") {
    doi = `${crossRefUser.doi_prefix}/edtechhub.${item.callNumber}`;
    console.log(`DOI from item.callNumber: ${doi}`) 
  } */
  const url = item.url
  const institution = item.institution
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

  const year = Sugar.Date.format(itemdate, '%Y');
  const month = Sugar.Date.format(itemdate, '%m');
  const day = Sugar.Date.format(itemdate, '%d');

  const result = `<?xml version="1.0" encoding="UTF-8"?>
  <doi_batch version="4.4.2" xmlns="http://www.crossref.org/schema/4.4.2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:jats="http://www.ncbi.nlm.nih.gov/JATS1" xsi:schemaLocation="http://www.crossref.org/schema/4.4.2 http://www.crossref.org/schema/deposit/crossref4.4.2.xsd">
  <head>
  <doi_batch_id>BATCH_${CreateDate}</doi_batch_id>
  <timestamp>${CreateDate}</timestamp>
  <depositor>
    <depositor_name>${crossRefUser.depositor_name}</depositor_name> 
    <email_address>${crossRefUser.email_address}</email_address>
  </depositor>
  <registrant>zotero-lib</registrant> 
  </head>
  <body>
    <report-paper>
      <report-paper_metadata>
        <contributors>
        ${creatorsList}
        </contributors>
        <titles>
         <title>${xmlescape(item.title)}</title>
        </titles>
        <jats:abstract xml:lang='en'>
        <jats:p>${xmlescape(item.abstractNote)}</jats:p>
        </jats:abstract>    
        <publication_date media_type='online'>
        <month>${month}</month>
        <day>${day}</day>
        <year>${year}</year>
        </publication_date>
        <publisher>
         <publisher_name>${xmlescape(institution)}</publisher_name>
        </publisher>
        <institution>
         <institution_name>${xmlescape(institution)}</institution_name>
        </institution>
        <doi_data>
         <doi>${doi}</doi>
         <resource>${url}</resource>
        </doi_data>
    </report-paper_metadata>
   </report-paper>
  </body>
  </doi_batch>
`;

  if (args.crossref_submit) {
    /*
    const FormData = require('form-data');
    const axios = require('axios');
    var form = new FormData();
    form.append('operation', 'doMDUpload');
    form.append('login_id', crossRefUser.depositor_name.replace(':', '/'));
    form.append('login_passwd', crossRefUser.password);
    form.append('fname', result);
    await axios({
      method: "post",
      url: "https://doi.crossref.org/servlet/deposit",
      data: form,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        //handle success
        console.log(response);
      })
      .catch(function (response) {
        //handle error
        console.log(response);
      }); */
    await fs.writeFile("crossref.xml", result, 'utf-8', function (err) {
      if (err) return console.log(err);
    })
    const { Curl } = require('node-libcurl');
    try {
      const curl = new Curl();
      // const close = curl.close.bind(curl);

      curl.setOpt(Curl.option.URL, 'https://doi.crossref.org/servlet/deposit');
      curl.setOpt(Curl.option.HTTPPOST, [
        { name: 'operation', contents: 'doMDUpload' },
        { name: 'login_id', contents: crossRefUser.depositor_name.replace(':', '/') },
        { name: 'login_passwd', contents: crossRefUser.password },
        { name: 'fname', file: 'crossref.xml', type: 'text/plain' },
      ]);
      // curl.setOpt(Curl.option.POST, true)

      curl.on('end', function (statusCode, data, headers) {
        console.log("******** CURL SUBMISSION **** Status code " + statusCode);
        console.log("***");
        console.log("Our response: " + data);
        console.log("***");
        console.log("Length: " + data.length);
        console.log("***");
        console.log("Total time taken: " + this.getInfo("TOTAL_TIME"));
        this.close();
      });
      curl.on('error', function () {
        console.log("CURL ERROR");
        this.close();
      });
      await curl.perform();
      /* This await doesn't work. */
      console.log("DONE!")
    } catch (error) {
      console.log("ERROR! [in submission]" + error)
    }
    if (args.crossref_confirm) {
      function sleep(ms) {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
      }
      console.log("Confirming...")
      // Adding a sleep here - the await above doesn't work.
      await sleep(3000)
      let loopit = true
      let counter = 0
      // We want to check (every 3 secs) for 
      const doiorg = `https://doi.org/${doi}`
      // until it turns from a 404 into a 302/200.
      console.log(doiorg)
      while (loopit) {
        counter++;
        console.log(counter)
        const curl = new Curl();
        // const close = curl.close.bind(curl);      
        curl.setOpt(Curl.option.URL, doiorg);
        curl.setOpt('FOLLOWLOCATION', true);
        curl.on('end', function (statusCode, data, headers) {
          console.log("******** CURL CHECK **** Status code " + statusCode);
          //console.log("***");
          //console.log("Our response: " + data);
          //console.log("***");
          console.log("Length: " + data.length);
          //console.log("***");
          console.log("Total time taken: " + this.getInfo("TOTAL_TIME"));
          this.close();
          if (statusCode == 200) {
            loopit = false
          } else {
            // await sleep(1000);
          }
        });
        curl.on('error', function () {
          console.log("CURL ERROR");
          // await sleep(1000);
          this.close();
        });
        await curl.perform();
        if (loopit)
          await sleep(5000);
      }
    }
  } else {
    await fs.writeFile("crossref.xml", result, 'utf-8', function (err) {
      if (err) return console.log(err);
    })
    console.log(`You can submit your data like this:\ncurl -F 'operation=doMDUpload'  -F 'login_id=${crossRefUser.depositor_name.replace(':', '/')}' -F 'login_passwd=${crossRefUser.password}' -F 'fname=@crossref.xml' https://doi.crossref.org/servlet/deposit`);
    console.log("You can check your xml at https://www.crossref.org/02publishers/parser.html\nor check the uploaded record here:\nhttps://doi.crossref.org/servlet/submissionAdmin")
  }

  return result;
}


