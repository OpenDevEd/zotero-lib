import { CompareArgs, Deduplicate_func_result } from '../types/compare';
import { Creator, Item } from '../types/item';

/**
 * This function compares two items and returns a boolean value indicating if the items are identical.
 * @param {Item} item - The first item to compare.
 * @param {Item} item2 - The second item being compared to the first item (item) in the compare function.
 */
export default async function compare(item: Item, item2: Item, args: CompareArgs): Promise<Deduplicate_func_result> {
  let temp = await DeleteExtra(item);
  let temp2 = await DeleteExtra(item2);
  // console.log(temp);
  // console.log(temp2);
  // console.log("-------------------------------------------------");

  // process.exit(0);

  // compare the two objects
  if (!args.mode) {
    if ((await CompareAllFields(temp, temp2)) && (await compareCreators(temp.creators, temp2.creators)))
      return { result: true, reason: 'identical' };
    else if ((await CompareAllFieldsLowerCase(temp, temp2)) && (await compareCreators(temp.creators, temp2.creators)))
      return { result: true, reason: 'identical_in_lowercase' };
    else if (await compareIdenticalInSeveralFields(temp, temp2))
      return { result: true, reason: 'identicalInTitleAndAuthors' };
    else if (await compareDIO(temp, temp2)) return { result: true, reason: 'same_doi_but_other_variations' };
  } else {
    if (
      (await CompareAllFields(temp, temp2)) &&
      (await compareCreators(temp.creators, temp2.creators)) &&
      args.mode === 'identical'
    )
      return { result: true, reason: 'identical' };
    else if (
      (await CompareAllFieldsLowerCase(temp, temp2)) &&
      (await compareCreators(temp.creators, temp2.creators)) &&
      args.mode === 'identical_in_lowercase'
    )
      return { result: true, reason: 'identical_in_lowercase' };
    else if ((await compareIdenticalInSeveralFields(temp, temp2)) && args.mode === 'identical_in_several_fields')
      return { result: true, reason: 'identicalInTitleAndAuthors' };
    else if ((await compareDIO(temp, temp2)) && args.mode === 'same_doi')
      return { result: true, reason: 'same_doi_but_other_variations' };
  }
  return { result: false, reason: 'not_identical' };
}

//TODO:DRY
// write function to compare creators
/**
 * This function compares two arrays of creators and returns a boolean value indicating if the creators are the same.
 * @param {Creator[]} creators - The first array of creators to compare.
 * @param {Creator[]} creators2 - The second array of creators to compare.
 */
async function compareCreators(creators: Creator[], creators2: Creator[]): Promise<boolean> {
  try {
    // check if both are empty
    if ((creators === undefined || creators === null) && (creators2 === undefined || creators2 === null)) return true;
    if (creators === undefined || creators === null || creators2 === undefined || creators2 === null) return false;
    if (creators.length === 0 && creators2.length === 0) return true;

    if (creators.length === creators2.length) {
      for (let i = 0; i < creators.length; i++) {
        if (creators[i].firstName !== creators2[i].firstName && creators[i].lastName !== creators2[i].lastName) {
          return false;
        }
      }
    } else return false;
  } catch (error) {
    console.log(error);
  }
  return true;
}
//@ts-ignore
async function DeleteExtra(item: Item): Promise<Item> {
  let temp = item;

  delete temp.accessDate;
  delete temp.extra;
  delete temp.relations;
  delete temp.dateAdded;
  delete temp.dateModified;
  delete temp.tags;
  delete temp.version;
  delete temp.collections;

  return temp;
}

//@ts-ignore
async function CompareAllFields(item: Item, item2: Item): Promise<boolean> {
  // compare the two objects
  // get all the keys of the object

  //TODO: compare date by convert to date and then compare
  let keys = Object.keys(item);

  // compare creators

  if (!(await compareCreators(item.creators, item2.creators))) return false;

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

/**
 * This function compares all fields of two objects, converting string values to lowercase and
 * returning true if they match.
 * @param item - The first object to compare.
 * @param item2 - The second object being compared to the first object (item) in the
 * CompareAllFieldsLowerCase function.
 * @returns a boolean value. It returns true if all the non-creator and non-key fields of the two input
 * objects are equal (ignoring case for string values), and false otherwise.
 */
async function CompareAllFieldsLowerCase(item: Item, item2: Item): Promise<boolean> {
  // compare the two objects
  // get all the keys of the object
  let keys = Object.keys(item);
  // remove creator key
  keys.splice(keys.indexOf('creators'), 1);
  keys.splice(keys.indexOf('key'), 1);

  for (let i = 0; i < keys.length; i++) {
    // check the type of the value if it is string then convert to lowercase
    if (!((await isEmpty(item[keys[i]])) && (await isEmpty(item2[keys[i]])))) {
      if (typeof item[keys[i]] === 'string' && typeof item2[keys[i]] === 'string') {
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

  return true;
}

// async function compareIdenticalInSeveralFields(item, item2) {
//   // compare the two objects
//   // get all the keys of the object
//   if (!['statute', 'note', 'email', 'case','annotation'].includes(item.itemType)
//   && !['statute', 'note', 'email', 'case','annotation'].includes(item2.itemType)
//   ) {
//     // console.log(item.key,item2.key,await compareCreators(item.creators, item2.creators));
//     try {
//       if (
//         //TODO : create a tag to ignore detecting the item _ignore-duplicate
//         //TODO : check for title, creators
//         //TODO : change the category from identicalInSeveralFields to identicalInTitleAndAuthors
//         //
//         item.title.toLowerCase() === item2.title.toLowerCase() &&
//         //TODO : remove itemTypes
//        // item.itemType.toLowerCase() === item2.itemType.toLowerCase() &&
//         (await compareCreators(item.creators, item2.creators))
//       )
//         return true;
//     } catch (error) {
//       console.log(item2.itemType);

//     }

//   }

//   if (item.itemType === 'note' && item2.itemType === 'note') {
//     if (item.note.toLowerCase() === item2.note.toLowerCase()) return true;
//   }
//   if (item.itemType === 'email' && item2.itemType === 'email') {
//     if (item.subject.toLowerCase() === item2.subject.toLowerCase()) return true;
//   }
//   if (item.itemType === 'statute' && item2.itemType === 'statute') {
//     if (item.nameOfAct.toLowerCase() === item2.nameOfAct.toLowerCase())
//       return true;
//   }
//   if (item.itemType === 'case' && item2.itemType === 'case') {
//     if (item.caseName.toLowerCase() === item2.caseName.toLowerCase())
//       return true;
//   }

//   return false;
// }

/**
 * This function compares two objects based on identical values in specific fields and returns a
 * boolean indicating if there are at least two matches.
 * @param {any} item - The first object to compare, which contains properties to be compared with the
 * second object.
 * @param {any} item2 - The `item2` parameter is an object that is being compared to another object
 * (`item`) for identical values in several fields.
 * @returns A boolean value is being returned.
 */
async function compareIdenticalInSeveralFields(item: Item, item2: Item): Promise<boolean> {
  const keys1 = Object.keys(item);
  const keys2 = Object.keys(item2);

  const keys = ['title', 'email', 'note', 'subject', 'statute', 'case', 'annotation'];

  let score = 0;
  for (const key1 of keys1) {
    if (!keys.includes(key1)) {
      continue;
    }

    for (const key2 of keys2) {
      if (!keys.includes(key2)) {
        continue;
      }

      const value1 = item[key1]?.toLowerCase()?.trim();
      const value2 = item2[key2]?.toLowerCase()?.trim();

      if (value1 && value2 && value1 === value2) {
        score++;
      }
    }
  }

  if (await compareCreators(item.creators, item2.creators)) {
    score++;
  }

  return score > 1;
}

// //@ts-ignore
// var stringSimilarity = require('string-similarity');
/**
 * This function compares two objects based on their DOI values and returns a boolean indicating if the DOI values are the same.
 * @param {Item} item - The first object to compare, which contains a DOI value that is being compared with the DOI value of the second object.
 * @param {Item} item2 - The `item2` parameter is an object that is being compared to another object (`item`) for identical DOI values.
 */
async function compareDIO(item: Item, item2: Item): Promise<boolean> {
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

/**
 * This function checks if a string is empty and returns a boolean value.
 */
async function isEmpty(str: string): Promise<boolean> {
  if (str === undefined || str === null || str === '') return true;
  return false;
}
