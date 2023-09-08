const Zotero = require('../build/zotero-lib');

(async () => {

  // get collection and generate sub collections
  const zotero = new Zotero({ verbose: true, 'group-id': 4830191 });

  // const collections = await zotero.collections({
  //   key: '7I6TFI8X',
  //   terse: true,
  //   create_child:['test1','test2','test3']
  // });
  // check if the sub collections are created
  const children = await zotero.collections({
    key: '7I6TFI8X',
    terse: true,
  });
  
  console.log(children);





  // get arguments from command line
  // let args = process.argv.slice(2);
  // console.log(args);

  // // get all types
  // let types = await zotero.types();
  // let result=[];
  // let list = [];
  // console.log("------------------");
  // for (let i = 0; i < types.length; i++) {
  //   const element = types[i];
  //   let temp = await zotero.create_item({template: element.itemType});
  //   //get all keys 
  //   let keys = Object.keys(temp);
  //   // add unique keys to keys array
  //   if(element.itemType ==='report')
  //   for (let j = 0; j < keys.length; j++) {
  //     const key = keys[j];
  //     if (list.indexOf(key) === -1) {
  //       list.push(key);
  //     }
  //   }

   
    
  //   // get all keys
  //    keys = Object.keys(temp);
  //   // search inside each key in keys for arg0 with indexOf
  //   console.log("---------",element.itemType,"------");
  //   if(element.itemType ==='email')
  //   console.log(temp);
  //   else if(element.itemType ==='case')
  //   console.log(temp);
  //   else if(element.itemType ==='statute')
  //   console.log(temp);
  //   for (let j = 0; j < keys.length; j++) {
  //     const key = keys[j];
  //     //console.log(key);
  //     if (key.indexOf(args[0]) > -1) {
  //       console.log("",key);
  //     }
      
  //   }
    
    
    
  // }
  // const fs = require('fs');
  // // save list to file
  // fs.writeFileSync("keys2.txt" , list.join(",\r"));
})();
