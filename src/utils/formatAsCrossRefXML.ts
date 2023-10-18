import logger from '../logger';

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
  ].find(cfg => fs.existsSync(cfg));
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

  let authorDataExpanded = {};
  for (const key in authorData) {
    authorDataExpanded[key] = authorData[key];
    for (const variation in authorData[key].aliases) {
      authorDataExpanded[authorData[key].aliases[variation]] = authorData[key];
    }
  }

  let seq = 'first';
  const creatorsList = creators
    .map((c: Creator) => {
      let person = '';
      let orcid = '';
      let org = '';
      const fullname = 'name' in c ? c.name : `${c.firstName} ${c.lastName}`;
      if (fullname in authorDataExpanded) {
        if (authorDataExpanded[fullname]['orcid']) {
          orcid = `<ORCID>${authorDataExpanded[fullname]['orcid']}</ORCID>`;
        }
        if (authorDataExpanded[fullname]['organization']) {
          org = `<organization sequence='${seq}' contributor_role='${c.creatorType}'>${authorDataExpanded[fullname]['organization']}</organization>`;
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
</person_name>${org}`;
      }
      seq = 'additional';
      return person;
    })
    .join('\n');
  // <ORCID>https://orcid.org/...</ORCID>

  const today = Sugar.Date.format(new Date(), '%Y%m%d%H%M%S') + '000'; // "[THEDATE]" // new Date().toDateString('DD-MMM-YYYY')
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
  ].find(cfg => fs.existsSync(cfg));
  const crossRefUser = crossRefUserIn
    ? JSON.parse(fs.readFileSync(crossRefUserIn, 'utf-8'))
    : { depositor_name: 'NAME:ROLE', email_address: 'EMAIL' };
  // console.log("TEMPORARY="+JSON.stringify(   crossRefUser         ,null,2))

  const extra = item.extra;
  let doi = '';
  if ('doi' in item) {
    doi = item.doi;
    console.log(`DOI from item.doi: ${doi}`);
  } else {
    extra.split('\n').forEach(element => {
      var mymatch = element.match(/^DOI\:\s*(.*?)\s*$/);
      if (mymatch) {
        doi = mymatch[1];
      }
    });
    if (doi) {
      console.log(`DOI from item.extra: ${doi}`);
    }
  }
  /*
  if (!doi && item.callNumber != "") {
    doi = `${crossRefUser.doi_prefix}/edtechhub.${item.callNumber}`;
    console.log(`DOI from item.callNumber: ${doi}`) 
  } */
  const url = item.url;
  const institution = item.institution;
  // console.log("TEMPORARY="+JSON.stringify(   item         ,null,2))

  let itemdate = item.date;
  const match = item.date.match(/(\d\d?)\/(\d\d?)\/(\d\d\d\d)/);
  if (match) {
    itemdate = match[3] + '-' + match[2] + '-' + match[1];
  }
  logger.info('DATE: ' + itemdate);
  try {
    itemdate = Sugar.Date.create(itemdate);
  } catch (error) {
    itemdate = Sugar.Date.format(new Date(), '%Y-%m-%d');
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
    const fname = await crossref_submit(CreateDate, result, crossRefUser);
    if (!args.crossref_no_confirm) {
      await crossref_confirm(fname, doi, crossRefUser);
    }
  } else {
    await fs.writeFile('crossref.xml', result, 'utf-8', function (err) {
      if (err) return console.log(err);
    });
    console.log(
      `You can submit your data like this:\ncurl -F 'operation=doMDUpload'  -F 'login_id=${crossRefUser.depositor_name.replace(
        ':',
        '/'
      )}' -F 'login_passwd=${
        crossRefUser.password
      }' -F 'fname=@crossref.xml' https://doi.crossref.org/servlet/deposit`
    );
    console.log(
      'You can check your xml at https://www.crossref.org/02publishers/parser.html\nor check the uploaded record here:\nhttps://doi.crossref.org/servlet/submissionAdmin'
    );
  }
  return result;
}

async function crossref_submit(CreateDate, result, crossRefUser) {
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
  const fname = `crossref-${CreateDate}.xml`;
  await fs.writeFile(fname, result, 'utf-8', function (err) {
    if (err) return console.log(err);
  });
  const { Curl } = require('node-libcurl');
  try {
    const curl = new Curl();
    // const close = curl.close.bind(curl);

    curl.setOpt(Curl.option.URL, 'https://doi.crossref.org/servlet/deposit');
    curl.setOpt(Curl.option.HTTPPOST, [
      { name: 'operation', contents: 'doMDUpload' },
      { name: 'login_id', contents: crossRefUser.depositor_name.replace(':', '/') },
      { name: 'login_passwd', contents: crossRefUser.password },
      { name: 'fname', file: fname, type: 'text/plain' },
    ]);
    // curl.setOpt(Curl.option.POST, true)

    curl.on('end', function (statusCode, data, headers) {
      console.log('******** SUBMISSION **** Status code ' + statusCode);
      // console.log("***");
      // console.log("Our response: " + data);
      // console.log("***");
      // console.log("Length: " + data.length);
      /// console.log("***");
      // TODO: What if this fails?
      console.log('Total time taken: ' + this.getInfo('TOTAL_TIME'));
      this.close();
    });
    curl.on('error', function () {
      console.log('CURL ERROR');
      this.close();
    });
    await curl.perform();
    /* This await doesn't work. */
    console.log('DONE!');
  } catch (error) {
    console.log('ERROR! [in submission]' + error);
  }
  return fname;
}

async function crossref_confirm(fname, doi, crossRefUser) {
  const { Curl } = require('node-libcurl');
  console.log('Checking submission progress.');
  function sleep(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }
  // console.log("Confirming...")
  // Adding a sleep here - the await above doesn't work.
  await sleep(3000);
  let loopit = true;
  let counter = 0;
  // We want to check (every 3 secs) for
  // https://doi.crossref.org/servlet/submissionDownload?usr=name@someplace.com/role&pwd=_password_&doi_batch_id=_doi batch id_&file_name=filename&type=_submission type_
  // https://doi.crossref.org/servlet/submissionDownload?usr=_role_&pwd=_password_&doi_batch_id=_doi batch id_&file_name=filename&type=_submission type_
  while (loopit) {
    counter++;
    console.log(counter);
    const curl = new Curl();
    // const close = curl.close.bind(curl);
    curl.setOpt(Curl.option.URL, 'https://doi.crossref.org/servlet/submissionDownload');
    curl.setOpt(Curl.option.HTTPPOST, [
      { name: 'usr', contents: crossRefUser.depositor_name.replace(':', '/') },
      { name: 'pwd', contents: crossRefUser.password },
      { name: 'type', contents: 'result' },
      { name: 'file_name', contents: fname },
    ]);
    curl.on('end', function (statusCode, data, headers) {
      // console.log("*** CHECKING BATCH " + statusCode);
      const stat = data.match('doi_batch_diagnostic status="(.*?)"');
      if (stat) {
        console.log('Batch Status: ' + stat[1]);
      }
      /* console.log("***");
      console.log("Our response: " + data);
      console.log("***");
      console.log("Length: " + data.length);
      console.log("***");
      console.log("Total time taken: " + this.getInfo("TOTAL_TIME")); */
      this.close();
      // Addressed: The following won't work if ther are several items in the batch - should be fixed apart from error count/warning count
      /*
      <batch_data>
      <record_count>1</record_count>
      <success_count>0</success_count>
      <warning_count>0</warning_count>
      <failure_count>1</failure_count>
      </batch_data>
      */
      // FIXED: If there's a problem, the process will never exit - process now terminates on error.
      const recordCountStr = data.match(/<record_count>(\d+)<\/record_count>/);
      let recordCount = '0';
      if (recordCountStr) {
        recordCount = recordCount[2];
        console.log(`recordCount = ${recordCount}`);
      }
      const successCountStr = data.match(/<success_count>(\d+)<\/success_count>/);
      let successCount = '0';
      if (successCountStr) {
        successCount = successCountStr[2];
        if (successCount == recordCount) {
          loopit = false;
        }
        console.log(`successCount = ${successCount}`);
      } else {
        // console.log("Doing another iteration.")
        // await sleep(1000);
      }
      if (data.match(/<failure_count>\d+<\/failure_count>/)) {
        loopit = false;
        console.log(`There was an error!! Message = ${data}`);
      } else {
        // console.log("Doing another iteration.")
        // await sleep(1000);
      }
    });
    curl.on('error', function () {
      console.log('CURL ERROR');
      // await sleep(1000);
      this.close();
    });
    await curl.perform();
    if (loopit) await sleep(3000);
  }
  // We want to check (every 3 secs) for
  const doiorg = `https://doi.org/${doi}`;
  console.log(`DOI with link: ${doiorg}`);
  loopit = true;
  while (loopit) {
    counter++;
    console.log(counter);
    const curl = new Curl();
    // const close = curl.close.bind(curl);
    curl.setOpt(Curl.option.URL, doiorg);
    curl.setOpt('FOLLOWLOCATION', true);
    curl.on('end', function (statusCode, data, headers) {
      console.log('*** CHECKING DOI: Status code ' + statusCode);
      //console.log("***");
      //console.log("Our response: " + data);
      //console.log("***");
      // console.log("Length: " + data.length);
      //console.log("***");
      // console.log("Total time taken: " + this.getInfo("TOTAL_TIME"));
      this.close();
      if (statusCode == 200) {
        console.log('Success!');
        loopit = false;
      } else {
        // await sleep(1000);
      }
    });
    curl.on('error', function () {
      console.log('CURL ERROR');
      // await sleep(1000);
      this.close();
    });
    await curl.perform();
    console.log('X');
    if (loopit) await sleep(2000);
    console.log('Y');
  }
  console.log('Done');
}
