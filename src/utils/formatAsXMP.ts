type Creator = { name: string; creatorType: string } | { firstName: string; lastName: string; creatorType: string };
interface ZoteroItem {
  creators?: [];
  rights: any;
  title: string;
  abstractNote: string;
}
export default function formatAsXMP(item: ZoteroItem = {} as ZoteroItem): string {
  const { creators = [] } = item;
  const creatorsList = creators
    .map((c: Creator) => {
      if ('name' in c) {
        return `<rdf:li>${c.name} (${c.creatorType})</rdf:li>`;
      }

      return `<rdf:li>${c.firstName} ${c.lastName} (${c.creatorType})</rdf:li>`;
    })
    .join('\n');

  const today = new Date().toISOString();
  const ModifyDate = today;
  const CreateDate = today;
  const MetadataDate = today;
  const DocumentID = '';
  const InstanceID = '';
  const keywords = '';
  const Producer = '';

  const result = `<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 5.6-c017 91.164464, 2020/06/15-10:20:05        ">
   <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
      <rdf:Description rdf:about=""
            xmlns:pdf="http://ns.adobe.com/pdf/1.3/"
            xmlns:dc="http://purl.org/dc/elements/1.1/"
            xmlns:xmp="http://ns.adobe.com/xap/1.0/"
            xmlns:xmpMM="http://ns.adobe.com/xap/1.0/mm/">
         <dc:format>application/pdf</dc:format>
         <dc:title>
            <rdf:Alt>
               <rdf:li xml:lang="x-default">${item.title}</rdf:li>
            </rdf:Alt>
         </dc:title>
         <dc:creator>
            <rdf:Seq>
                    ${creatorsList}
            </rdf:Seq>
         </dc:creator>
         <dc:description>
            <rdf:Alt>
               <rdf:li xml:lang="x-default">${item.abstractNote} </rdf:li>
            </rdf:Alt>
         </dc:description>
         <pdf:Keywords>${keywords}</pdf:Keywords>
         <pdf:Copyright>${item.rights}</pdf:Copyright>
         <xmp:ModifyDate>${ModifyDate}</xmp:ModifyDate>
         <xmp:CreateDate>${CreateDate}</xmp:CreateDate>
         <xmp:MetadataDate>${MetadataDate}</xmp:MetadataDate>
         <xmpMM:DocumentID>${DocumentID}</xmpMM:DocumentID>
         <xmpMM:InstanceID>${InstanceID}</xmpMM:InstanceID>
         <pdf:Producer>${Producer}</pdf:Producer>
      </rdf:Description>
   </rdf:RDF>
</x:xmpmeta>`;

  return result;
}
