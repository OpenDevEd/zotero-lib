const Zotero = require('../build/zotero-lib');

(async () => {

  // get arguments from command line
  let args = process.argv.slice(2);
  console.log(args);

  let zotero = new Zotero({});
  // get all types
  let types = await zotero.types();
  let result=[];
  console.log("------------------");
  for (let i = 0; i < types.length; i++) {
    const element = types[i];
    let temp = await zotero.create_item({template: element.itemType});
    result.push(temp);
    // get all keys
    let keys = Object.keys(temp);
    // search inside each key in keys for arg0 with indexOf
    console.log("---------",element.itemType,"------");
    if(element.itemType ==='email')
    console.log(temp);
    else if(element.itemType ==='case')
    console.log(temp);
    else if(element.itemType ==='statute')
    console.log(temp);
    for (let j = 0; j < keys.length; j++) {
      const key = keys[j];
      //console.log(key);
      if (key.indexOf(args[0]) > -1) {
        console.log("",key);
      }
      
    }
    
    
    
  }
  //console.log(result);
})();
