interface deduplicate_func_result {
  result: boolean;
  reason: string;
}

export default async function compare(
  item,
  item2,
): Promise<deduplicate_func_result> {
  let temp = await DeleteExtra(item);
  let temp2 = await DeleteExtra(item2);
  // console.log(temp);
  // console.log(temp2);
  // console.log("-------------------------------------------------");

  // process.exit(0);

  // compare the two objects

  if (
    (await CompareAllFields(temp, temp2)) &&
    (await compareCreators(temp.creators, temp2.creators))
  )
    return { result: true, reason: 'identical' };
  else if (
    (await CompareAllFieldsLowerCase(temp, temp2)) &&
    (await compareCreators(temp.creators, temp2.creators))
  )
    return { result: true, reason: 'identical_in_lowercase' };
  else if (await compareIdenticalInSeveralFields(temp, temp2))
    return { result: true, reason: 'identical_in_several_fields' };
  else if (await comareDIO(temp, temp2))
    return { result: true, reason: 'same_doi_but_other_variations' };

  return { result: false, reason: 'not_identical' };
}

// write function to compare creators
async function compareCreators(creators, creators2) {
  try {
    // check if both are empty
    if (
      (creators === undefined || creators === null) &&
      (creators2 === undefined || creators2 === null)
    )
      return true;
    if (creators.length === 0 && creators2.length === 0) return true;

    if (creators.length === creators2.length) {
      for (let i = 0; i < creators.length; i++) {
        if (
          creators[i].firstName !== creators2[i].firstName &&
          creators[i].lastName !== creators2[i].lastName
        ) {
          return false;
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
  return true;
}
//@ts-ignore
async function DeleteExtra(item) {
  let temp = item;
  delete temp.accessDate;
  delete temp.extra;
  delete temp.relations;
  delete temp.dateAdded;
  delete temp.dateModified;
  delete temp.tags;

  return temp;
}

//@ts-ignore
async function CompareAllFields(item, item2) {
  // compare the two objects
  // get all the keys of the object

  //TODO: compare date by convonerting to date and then compare
  let keys = Object.keys(item);

  // remove creator key
  keys.splice(keys.indexOf('creators'), 1);
  keys.splice(keys.indexOf('key'), 1);

  for (let i = 0; i < keys.length; i++) {
    if (item[keys[i]] !== item2[keys[i]]) {
      return false;
    }
  }

  return true;
}

async function CompareAllFieldsLowerCase(item, item2) {
  // compare the two objects
  // get all the keys of the object
  let keys = Object.keys(item);
  // remove creator key
  keys.splice(keys.indexOf('creators'), 1);
  keys.splice(keys.indexOf('key'), 1);

  if (keys) {
    for (let i = 0; i < keys.length; i++) {
      // check the type of the value if it is string then convert to lowercase
      if (
        !((await isEmpty(item[keys[i]])) && (await isEmpty(item2[keys[i]])))
      ) {
        if (
          typeof item[keys[i]] === 'string' &&
          typeof item2[keys[i]] === 'string'
        ) {
          if (item[keys[i]].toLowerCase() !== item2[keys[i]].toLowerCase()) {
            return false;
          }
        } else {
          if (item[keys[i]] !== item2[keys[i]]) {
            return false;
          }
        }
      }
    }
  }

  return true;
}

async function compareIdenticalInSeveralFields(item, item2) {
  // compare the two objects
  // get all the keys of the object
  if (!['statute', 'note', 'email', 'case'].includes(item.itemType)) {
    if (
      item.title.toLowerCase() === item2.title.toLowerCase() &&
      item.itemType.toLowerCase() === item2.itemType.toLowerCase() &&
      (await compareCreators(item.creators, item2.creators))
    )
      return true;
  }

  if (item.itemType === 'note' && item2.itemType === 'note') {
    if (item.note.toLowerCase() === item2.note.toLowerCase()) return true;
  }
  if (item.itemType === 'email' && item2.itemType === 'email') {
    if (item.subject.toLowerCase() === item2.subject.toLowerCase()) return true;
  }
  if (item.itemType === 'statute' && item2.itemType === 'statute') {
    if (item.nameOfAct.toLowerCase() === item2.nameOfAct.toLowerCase())
      return true;
  }
  if (item.itemType === 'case' && item2.itemType === 'case') {
    if (item.caseName.toLowerCase() === item2.caseName.toLowerCase())
      return true;
  }

  return false;
}
//@ts-ignore
var stringSimilarity = require('string-similarity');
async function comareDIO(item, item2) {
  // if(item.DOI && item2.DOI){
  //   var similarity = stringSimilarity.compareTwoStrings(item2.title, item.title);
  //   if(similarity > 0.73) {
  //     console.log(similarity);
  //     console.log("item1", item.key,item.title);
  //     console.log("item2", item2.key,item2.title);

  //     console.log("-------------------------------------------------");

  //   }

  // }

  if (item.DOI === item2.DOI && item2.DOI && item.DOI) return true;

  return false;
}

async function isEmpty(str) {
  if (str === undefined || str === null || str === '') return true;
  return false;
}
