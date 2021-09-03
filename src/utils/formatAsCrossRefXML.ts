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
}
export default function formatAsCrossRefXML(item: ZoteroItem = {} as ZoteroItem) {
  const { creators = [] } = item;
  let seq = "first"
  const creatorsList = creators
    .map((c: Creator) => {
      let person = ""
      if ('name' in c) {
      person = `<person_name sequence='${seq}' contributor_role='${c.creatorType}'>
      <given_name>${c.name}</given_name>
      <surname>${c.name}</surname>
</person_name>`;
      } else {
      person = `<person_name sequence='${seq}' contributor_role='${c.creatorType}'>
      <given_name>${c.firstName}</given_name>
      <surname>${c.lastName}</surname>
</person_name>`
      }
      seq = "additional"
      return person
    })
    .join('\n');
    // <ORCID>https://orcid.org/...</ORCID>
  
  const today = "[THEDATE]" // new Date().toDateString('DD-MMM-YYYY')
  //const ModifyDate = today;
  const CreateDate = today;
  //const MetadataDate = today;
  //const DocumentID = '';
  //const InstanceID = '';
  //const keywords = '';
  //const Producer = '';

  let doi = ""
  if (item.doi) {
     doi = item.doi
  } else if (item.callNumber) {
     doi = `10.53832/edtechhub.${item.callNumber}`;
  }
  const url = item.url
  const institution = item.institution
  // console.log("TEMPORARY="+JSON.stringify(   item         ,null,2))
   

  /*
  <rdf:li xml:lang="x-default">${item.title}</rdf:li>
  ${creatorsList}
<rdf:li xml:lang="x-default">${item.abstractNote} </rdf:li>
<pdf:Keywords>${keywords}</pdf:Keywords>
<pdf:Copyright>${item.rights}</pdf:Copyright>
<xmp:ModifyDate>${ModifyDate}</xmp:ModifyDate>
<xmp:CreateDate>${CreateDate}</xmp:CreateDate>
<xmp:MetadataDate>${MetadataDate}</xmp:MetadataDate>
<xmpMM:DocumentID>${DocumentID}</xmpMM:DocumentID>
<xmpMM:InstanceID>${InstanceID}</xmpMM:InstanceID>
<pdf:Producer>${Producer}</pdf:Producer>
*/

  const result = `<?xml version="1.0" encoding="UTF-8"?>
  <doi_batch version="4.4.2" xmlns="http://www.crossref.org/schema/4.4.2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:jats="http://www.ncbi.nlm.nih.gov/JATS1" xsi:schemaLocation="http://www.crossref.org/schema/4.4.2 http://www.crossref.org/schema/deposit/crossref4.4.2.xsd">
  <head>
  <doi_batch_id>BATCH_${CreateDate}</doi_batch_id>
  <timestamp>${CreateDate}</timestamp>
  <depositor>
    <depositor_name>NAME:ROLE</depositor_name> 
    <email_address>EMAIL</email_address>
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
         <title>${item.title}</title>
        </titles>
        <jats:abstract xml:lang='en'>
        <jats:p>${item.abstractNote}</jats:p>
        </jats:abstract>    
        <publication_date media_type='online'>
         <month>03</month>
         <day>01</day>
         <year>2021</year>
        </publication_date>
        <publisher>
         <publisher_name>${institution}</publisher_name>
        </publisher>
        <institution>
         <institution_name>${institution}</institution_name>
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
  
  return result;
}
