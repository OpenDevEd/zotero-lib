const Zotero = require('../build/zotero-lib');

async function main() {
  try {
    // please paste your code to test it here and run this command:
    // npm run test:cli_to_javascript
    let zotero = new Zotero();
    const options = {
      file: 'backup4.db',
      groupid: '2259720',
      keys: [
        '2317526:FJCUUSAE',
        '2317526:H2JCVTDI',
        '2129771:YNRBBDKJ',
        '2129771',
        '2129771:A62ZDWFW',
        '2129771:QEIBUIQH',
      ],
    };
    const result = await zotero.resolvefunc(options);
    console.log(result);
    //title = await test.field({'field':'title','value': `xxx${title.data}`, 'key':"JQ2T3F4D"})
  } catch (e) {
    console.log(e);
  }
}
main();
