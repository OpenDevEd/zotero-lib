import decorations from './decorations';

/**
 * This map contains custom cmd handlers for subparsers
 * for most subparsers the cmd handler is same as its key in this map
 * however for those which are different the mapping is provided below
 * e.g. for __
 */
const customCmdHandlers = new Map();
customCmdHandlers.set('create', 'create_item');
customCmdHandlers.set('update', 'update_item');
customCmdHandlers.set('enclose-item', 'enclose_item_in_collection');
customCmdHandlers.set('get-doi', 'get_doi');
customCmdHandlers.set('update-doi', 'update_doi');
customCmdHandlers.set('TEMPLATE', 'TEMPLATE');
customCmdHandlers.set('attach-link', 'attach_link');
customCmdHandlers.set('extra-append', 'extra_append');
customCmdHandlers.set('update-url', 'update_url');
customCmdHandlers.set('kciaka', 'KerkoCiteItemAlsoKnownAs');
customCmdHandlers.set('bibliography', 'getbib');
customCmdHandlers.set('attach-note', 'attach_note');
customCmdHandlers.set('db', 'manageLocalDB');
customCmdHandlers.set('resolve', 'resolvefunc');
customCmdHandlers.set('deduplicate', 'deduplicate_func');
customCmdHandlers.set('movetocollection', 'Move_deduplicate_to_collection');
customCmdHandlers.set('merge', 'merge_func');
customCmdHandlers.set('find-empty-items', 'findEmptyItems');
customCmdHandlers.set('get-ids', 'getIds');

function getFuncName(subCmdName) {
  if (customCmdHandlers.has(subCmdName)) {
    return customCmdHandlers.get(subCmdName);
  }

  return subCmdName;
}

const subParsersMap = new Map();

subParsersMap.set('items', function (subparsers, subCmdName) {
  // async items
  const argparser = subparsers.add_parser(subCmdName, {
    help: 'Retrieve items, retrieve items within collections, with filter is required. Count items. By default, all items are retrieved. With --top or limit (via --filter) the default number of items are retrieved. (API: /items, /items/top, /collections/COLLECTION/items/top)',
  });
  argparser.set_defaults({ func: getFuncName(subCmdName) });
  /* parser_items.add_argument('itemKeys', {
         nargs: "*",
         action: 'store_true',
         help: 'items for validation'
       }) */
  argparser.add_argument('--count', {
    action: 'store_true',
    help: 'Return the number of items.',
  });
  // argparser.add_argument('--all', { action: 'store_true', help: 'obsolete' })
  argparser.add_argument('--filter', {
    type: subparsers.json,
    help: 'Provide a filter as described in the Zotero API documentation under read requests / parameters. For example: \'{"format": "json,bib", "limit": 100, "start": 100}\'.',
  });
  argparser.add_argument('--collection', {
    help: 'Retrive list of items for collection. You can provide the collection key as a zotero-select link (zotero://...) to also set the group-id.',
  });
  argparser.add_argument('--top', {
    action: 'store_true',
    help: 'Retrieve top-level items in the library/collection (excluding child items / attachments, excluding trashed items).',
  });
  argparser.add_argument('--validate', {
    action: 'store_true',
    help: 'Validate the record against a schema. If your config contains zotero-schema, then that file is used. Otherwise supply one with --validate-with',
  });
  argparser.add_argument('--validate-with', {
    type: subparsers.path,
    help: 'json-schema file for all itemtypes, or directory with schema files, one per itemtype.',
  });
  argparser.add_argument('--json', {
    action: 'store',
    help: 'Provide output in json format E.g --json Items.json',
  });
});

subParsersMap.set('item', function (subparsers, subCmdName) {
  // async item
  const argparser = subparsers.add_parser(subCmdName, {
    help: 'Modify items: Add/remove tags, attach/save files, add to collection/remove, get child items. (API: /items/KEY/ or /items/KEY/children)',
  });
  argparser.set_defaults({ func: getFuncName(subCmdName) });
  argparser.add_argument('--key', {
    action: 'store',
    help: 'The key of the item. You can provide the key as zotero-select link (zotero://...) to also set the group-id.',
  });
  argparser.add_argument('--xmp', {
    action: 'store_true',
    help: 'Provide output in xmp format',
  });
  argparser.add_argument('--crossref', {
    action: 'store_true',
    help: 'Provide output in CrossRef XML format.',
  });
  argparser.add_argument('--crossref-user', {
    action: 'store',
    help: 'Supply a json file with user data for crossref: {depositor_name: "user@domain:role", email_address: "user@domain", password: ...}. If --crossref is specified without --crossref-user, default settings in your configuration directory are checked: ~/.config/zotero-cli/crossref-user.json',
  });
  // doi_batch_id: "optional", timestamp: "optional"
  argparser.add_argument('--crossref-submit', {
    action: 'store_true',
    help: `Password needs --crossref-user. This operation effectively runs curl -F 'operation=doMDUpload'  -F 'login_id=.../...' -F 'login_passwd=...' -F 'fname=@data.xml' https://doi.crossref.org/servlet/deposit`,
  });
  argparser.add_argument('--crossref-no-confirm', {
    action: 'store_true',
    help: `Checks whether the DOI successfully activates (requires --crossref-submit). If you are submitting an update (i.e., if the DOI is already active), this doesn't do anything useful.`,
  });
  argparser.add_argument('--zenodo', {
    action: 'store_true',
    help: 'Provide output in zenodo json format.',
  });
  /*
      The processing for authordata options in zotzen-lib is basic - need to check what we have in zenodo-lib. However, it might make sense to get Zotero to produce the required json for Zenodo.
      See 370755a6-0cfd-11ec-851b-77cdfd2128b9 in zotzen-lib
      */
  argparser.add_argument('--author-data', {
    action: 'store',
    help: 'Supply a json file with authors database, enabling extra author information to be added for crossref. If --crossref or --zenodo are specified without --author-data, default settings in your configuration director are checked: ~/.config/zotero-cli/author-data.json',
  });
  argparser.add_argument('--switch-names', {
    action: 'store_true',
    help: 'Switch firstName with lastName and vice versa in creators, ignoring name only creators',
    dest: 'switchNames',
  });
  argparser.add_argument('--organise-extra', {
    action: 'store_true',
    help: 'Organise extra field (processExtraField)',
  });

  argparser.add_argument('--children', {
    action: 'store_true',
    help: 'Retrieve list of children for the item.',
  });
  argparser.add_argument('--filter', {
    type: subparsers.json,
    help: 'Provide a filter as described in the Zotero API documentation under read requests / parameters. To retrieve multiple items you have use "itemkey"; for example: \'{"format": "json,bib", "itemkey": "A,B,C"}\'. See https://www.zotero.org/support/dev/web_api/v3/basics#search_syntax.',
  });
  argparser.add_argument('--addfiles', {
    nargs: '*',
    help: 'Upload attachments to the item. (/items/new)',
  });
  argparser.add_argument('--savefiles', {
    nargs: '*',
    help: 'Download all attachments from the item (/items/KEY/file).',
  });
  argparser.add_argument('--addtocollection', {
    nargs: '*',
    help: 'Add item to collections. (Convenience method: patch item->data->collections.)',
  });
  argparser.add_argument('--removefromcollection', {
    nargs: '*',
    help: 'Remove item from collections. (Convenience method: patch item->data->collections.)',
  });
  argparser.add_argument('--addtags', {
    nargs: '*',
    help: 'Add tags to item. (Convenience method: patch item->data->tags.)',
  });
  argparser.add_argument('--removetags', {
    nargs: '*',
    help: 'Remove tags from item. (Convenience method: patch item->data->tags.)',
  });
  argparser.add_argument('--validate', {
    action: 'store_true',
    help: 'Validate the record against a schema. If your config contains zotero-schema, then that file is used. Otherwise supply one with --validate-with',
  });
  argparser.add_argument('--validate-with', {
    type: subparsers.path,
    help: 'json-schema file for all itemtypes, or directory with schema files, one per itemtype.',
  });
  argparser.add_argument('--fullresponse', {
    action: 'store_true',
    help: 'Return the full response from the Zotero API.',
  });
});

subParsersMap.set('create', function (subparsers, subCmdName) {
  // async create item
  const argparser = subparsers.add_parser(subCmdName, {
    help: 'Create a new item or items. (API: /items/new) You can retrieve a template with the --template option. Use this option to create both top-level items, as well as child items (including notes and links).',
  });
  argparser.set_defaults({ func: getFuncName(subCmdName) });
  argparser.add_argument('--template', {
    help: "Retrieve a template for the item you wish to create. You can retrieve the template types using the main argument 'types'.",
  });
  argparser.add_argument('--files', {
    nargs: '*',
    help: 'Text files with JSON for the items to be created.',
  });
  argparser.add_argument('--items', {
    nargs: '*',
    help: 'JSON string(s) for the item(s) to be created.',
  });
  argparser.add_argument('--collections', {
    nargs: '*',
    help: 'The key of the collection in which the new item is created. You can provide the key as zotero-select link (zotero://...) to also set the group-id.',
  });
  argparser.add_argument('--newcollection', {
    nargs: 1,
    help: 'The title of the new collection in which the new item is created.',
  });
});

subParsersMap.set('update', function (subparsers, subCmdName) {
  // update item
  const argparser = subparsers.add_parser(subCmdName, {
    help: 'Update/replace an item (--key KEY), either update (API: patch /items/KEY) or replacing (using --replace, API: put /items/KEY).',
  });
  argparser.set_defaults({ func: getFuncName(subCmdName) });
  argparser.add_argument('--key', {
    required: true,
    help: 'The key of the item. You can provide the key as zotero-select link (zotero://...) to also set the group-id.',
  });
  argparser.add_argument('--replace', {
    action: 'store_true',
    help: 'Replace the item by sumbitting the complete json.',
  });
  argparser.add_argument('--json', {
    nargs: 1,
    help: 'New item as JSON. For library use, an object is possible.',
  });
  argparser.add_argument('--file', {
    nargs: 1,
    help: 'Path of file in json format.',
  });
  argparser.add_argument('--version', {
    nargs: 1,
    help: 'You have to supply the version of the item via the --version argument or else the latest version will be used.',
  });
});

//TODO: Discuss that trash is not implemented???
// parsersMap.set('trash', function (subparsers, subCmdName) {
//   return null;
// });

subParsersMap.set('publications', function (subparsers, subCmdName) {
  const argparser = subparsers.add_parser(subCmdName, {
    help: 'Return a list of items in publications (user library only). (API: /publications/items)',
  });
  argparser.set_defaults({ func: getFuncName(subCmdName) });
});

subParsersMap.set('types', function (subparsers, subCmdName) {
  const argparser = subparsers.add_parser(subCmdName, {
    help: 'Retrieve a list of items types available in Zotero. (API: /itemTypes).',
  });
  argparser.set_defaults({ func: getFuncName(subCmdName) });
});

subParsersMap.set('groups', function (subparsers, subCmdName) {
  const argparser = subparsers.add_parser(subCmdName, {
    help: 'Retrieve the Zotero groups data to which the current library_id and api_key has access to. (API: /users/<user-id>/groups)',
  });
  argparser.set_defaults({ func: getFuncName(subCmdName) });
});

subParsersMap.set('attachment', function (subparsers, subCmdName) {
  // async attachement
  const argparser = subparsers.add_parser(subCmdName, {
    help: "Save file attachments for the item specified with --key KEY (API: /items/KEY/file). Also see 'item', which has options for adding/saving file attachments. ",
  });
  argparser.set_defaults({ func: getFuncName(subCmdName) });
  argparser.add_argument('--key', {
    action: 'store',
    required: true,
    help: 'The key of the item. You can provide the key as zotero-select link (zotero://...) to also set the group-id.',
  });
  argparser.add_argument('--save', {
    action: 'store',
    required: true,
    help: 'Filename to save attachment to.',
  });
});

subParsersMap.set('fields', function (subparsers, subCmdName) {
  const argparser = subparsers.add_parser(subCmdName, {
    help: "Retrieve a template with the fields for --type TYPE (API: /itemTypeFields, /itemTypeCreatorTypes) or all item fields (API: /itemFields). Note that to retrieve a template, use 'create-item --template TYPE' rather than this command.",
  });
  argparser.set_defaults({ func: getFuncName(subCmdName) });
  argparser.add_argument('--type', {
    help: 'Display fields types for TYPE.',
  });
});

subParsersMap.set('searches', function (subparsers, subCmdName) {
  const argparser = subparsers.add_parser(subCmdName, {
    help: 'Return a list of the saved searches of the library. Create new saved searches. (API: /searches)',
  });
  argparser.set_defaults({ func: getFuncName(subCmdName) });
  argparser.add_argument('--create', {
    nargs: 1,
    help: 'Path of JSON file containing the definitions of saved searches.',
  });
});

subParsersMap.set('tags', function (subparsers, subCmdName) {
  const argparser = subparsers.add_parser(subCmdName, {
    help: 'Return a list of tags in the library. Options to filter and count tags. (API: /tags)',
  });
  argparser.set_defaults({ func: getFuncName(subCmdName) });
  argparser.add_argument('--filter', {
    help: 'Tags of all types matching a specific name.',
  });
  argparser.add_argument('--count', {
    action: 'store_true',
    help: 'TODO: document',
  });
});

subParsersMap.set('enclose-item', function (subparsers, subCmdName) {
  const argparser = subparsers.add_parser(subCmdName, {
    help: 'Utility function: Enlose the item in a collection and create further subcollections.',
  });
  argparser.set_defaults({ func: getFuncName(subCmdName) });
  argparser.add_argument('--key', {
    nargs: 1,
    action: 'store',
    help: 'The Zotero item key for the item to be enclosed.',
  });
  argparser.add_argument('--collection', {
    nargs: 1,
    action: 'store',
    help: 'The Zotero collection key in which the new collection is created. (Otherwise created at top level.)',
  });
  argparser.add_argument('--group-id', {
    nargs: 1,
    action: 'store',
    help: 'The Zotero group id.',
  });
  argparser.add_argument('--title', {
    nargs: 1,
    action: 'store',
    help: "The title for the new collection (otherwise it's derived from the item title).",
  });
});

subParsersMap.set('get-doi', function (subparsers, subCmdName) {
  const argparser = subparsers.add_parser(subCmdName, {
    help: 'Utility function: Get the DOI for the item.',
  });
  argparser.set_defaults({ func: getFuncName(subCmdName) });
  argparser.add_argument('--key', {
    nargs: 1,
    action: 'store',
    help: 'The Zotero item key for the item to be updated.',
  });
});
subParsersMap.set('update-doi', function (subparsers, subCmdName) {
  const argparser = subparsers.add_parser(subCmdName, {
    help: 'Utility function: Update the DOI for the item.',
  });
  argparser.set_defaults({ func: getFuncName(subCmdName) });
  argparser.add_argument('--key', {
    nargs: 1,
    action: 'store',
    help: 'The Zotero item key for the item to be updated.',
  });
  argparser.add_argument('--doi', {
    nargs: 1,
    action: 'store',
    help: 'The DOI for the item',
  });
  argparser.add_argument('--zenodoRecordID', {
    nargs: 1,
    action: 'store',
    help: 'The Zenodo record number for the item',
  });
});

subParsersMap.set('TEMPLATE', function (subparsers, subCmdName) {
  const argparser = subparsers.add_parser(subCmdName, {
    help: 'Dummy option to be used as tempate. No user-facing functionality.',
  });
  argparser.set_defaults({ func: getFuncName(subCmdName) });
  argparser.add_argument('--switch', {
    action: 'store_true',
    help: 'HELPTEXT',
  });
  argparser.add_argument('--arguments', {
    nargs: '*',
    action: 'store',
    help: 'HELPTEXT',
  });
});

subParsersMap.set('attach-link', function (subparsers, subCmdName) {
  const argparser = subparsers.add_parser(subCmdName, {
    help: 'Utility function: attach a link to an item',
  });
  argparser.set_defaults({ func: getFuncName(subCmdName) });
  argparser.add_argument('--key', {
    nargs: 1,
    action: 'store',
    help: 'Required.xx',
  });
  argparser.add_argument('--url', {
    nargs: 1,
    action: 'store',
    help: 'Provide a URL here and/or use the specific URL options below. If you use both --url and on of the options below, both will be added.',
  });
  argparser.add_argument('--update-url-field', {
    action: 'store_true',
    help: 'Update/overwrite the url field of the item. The url used is --url (if set) or --kerko-link-key.',
  });
  argparser.add_argument('--title', {
    nargs: 1,
    action: 'store',
    help: 'Optional. The options for specific URLs below can supply default titles.',
  });
  argparser.add_argument('--tags', {
    nargs: '*',
    action: 'store',
    help: 'Optional',
  });
  // TODO: There's a problem here... the following just offer docorations. We need to have inputs too...
  // This should probably just be the title used if there is no title, or --decorate is given.
  Object.keys(decorations).forEach((option) => {
    const extra_text =
      option === 'kerko_site_url'
        ? ' The item key will be added automatically.'
        : option === 'kerko_url'
        ? ' You need to provide the full URL with the item key.'
        : '';
    argparser.add_argument(`--${option}`, {
      nargs: 1,
      action: 'store',
      help: `Provide a specific URL for '${option}'.${extra_text} The prefix '${
        decorations[option].title
      }' will be added to a title (if provided) and the following tags are added: ${JSON.stringify(
        decorations[option].tags,
      )}`,
    });
  });
  // ... otherwise --id adds the three zenodo options, which otherwise are specified ...
  argparser.add_argument('--id', {
    nargs: 1,
    action: 'store',
    help: 'Provide a Zenodo id to add links for Zenodo record, deposit and doi.',
  });
  argparser.add_argument('--zenodo', {
    action: 'store_true',
    help: 'Determine Zenodo id from Zotero item and then add links for Zenodo record, deposit and doi.',
  });
  argparser.add_argument('--decorate', {
    action: 'store_true',
    help: "Optional 'decoration/default title prefix'. Without title, this is used anyway. But if you give a title, specify this option to have the prefix anyway.",
  });
});
subParsersMap.set('field', function (subparsers, subCmdName) {
  const argparser = subparsers.add_parser(subCmdName, {
    help: 'Utility function: Update a field for a specific item.',
  });
  argparser.set_defaults({ func: getFuncName(subCmdName) });
  argparser.add_argument('--key', {
    nargs: 1,
    action: 'store',
    help: 'The Zotero item key for the item to be updated.',
  });
  argparser.add_argument('--field', {
    nargs: 1,
    action: 'store',
    help: 'The field to be updated',
  });
  argparser.add_argument('--value', {
    nargs: 1,
    action: 'store',
    help: 'The value for the update (if not provided, the value of the field is shown).',
  });
  argparser.add_argument('--version', {
    nargs: 1,
    help: 'You have to supply the version of the item via the --version argument or else the latest version will be used.',
  });
  argparser.add_argument('--extra', {
    action: 'store_true',
    help: 'The field is in the extra field instead of the zotero official fields.',
  });
});
// TODO: Fix help text and text fundtion.
subParsersMap.set('extra-append', function (subparsers, subCmdName) {
  const argparser = subparsers.add_parser(subCmdName, {
    help: 'Utility function that appends text to the extra field of a specific item.',
  });
  argparser.set_defaults({ func: getFuncName(subCmdName) });
  argparser.add_argument('--switch', {
    action: 'store_true',
    help: 'HELPTEXT',
  });
  argparser.add_argument('--arguments', {
    nargs: '*',
    action: 'store',
    help: 'HELPTEXT',
  });
});

subParsersMap.set('update-url', function (subparsers, subCmdName) {
  const argparser = subparsers.add_parser(subCmdName, {
    help: 'Utility function: Update the url for a specific item.',
  });
  argparser.set_defaults({ func: getFuncName(subCmdName) });
  argparser.add_argument('--key', {
    nargs: 1,
    action: 'store',
    help: 'The Zotero item key for the item to be updated.',
  });
  argparser.add_argument('--value', {
    nargs: 1,
    action: 'store',
    help: 'The value for the update (if not provided, the value of the field is shown).',
  });
  argparser.add_argument('--version', {
    nargs: 1,
    help: 'You have to supply the version of the item via the --version argument or else the latest version will be used.',
  });
});

subParsersMap.set('kciaka', function (subparsers, subCmdName) {
  const argparser = subparsers.add_parser(subCmdName, {
    help: 'Utility function: View/merge - extra>Kerko.CiteItemAlsoKnownAs.',
  });
  argparser.set_defaults({ func: getFuncName(subCmdName) });
  argparser.add_argument('--key', {
    nargs: 1,
    action: 'store',
    help: 'The Zotero item key for the item to be updated.',
  });
  argparser.add_argument('--add', {
    nargs: '*',
    action: 'store',
    help: 'The value for the update (if not provided, the value of the field is shown).',
  });
});

subParsersMap.set('bibliography', function (subparsers, subCmdName) {
  const argparser = subparsers.add_parser(subCmdName, {
    help: 'Get bibliography',
  });
  argparser.add_argument('--key', {
    nargs: 1,
    action: 'store',
    help: 'A Zotero item key for the item for which the bib is obtained. Can be provided in zotero://select format.',
  });
  argparser.add_argument('--keys', {
    nargs: 1,
    action: 'store',
    help: 'A Zotero item key for the item for which the bib is obtained. Can be provided as list ABC,DEF,...',
  });
  argparser.add_argument('--group', {
    nargs: 1,
    action: 'store',
    help: 'If you use --keys, use --group to specify the group.',
  });
  argparser.add_argument('--groupkeys', {
    nargs: 1,
    action: 'store',
    help: 'The Zotero item key for the item for which the bib is obtained. Unlike other functions, this is a string of the format 1234567:ABCDEFGH,1234567:ABCDEFGH,...',
  });
  argparser.add_argument('--xml', {
    action: 'store_true',
    help: 'The default is for this function to return xml/html (wrapped in json). Use this switch to only return the xml.',
  });
  argparser.add_argument('--json', {
    action: 'store_true',
    help: 'The default is for this function to return xml/html (wrapped in json). Use this switch to convert the xml to json.',
  });
  argparser.add_argument('--zgroup', {
    nargs: 1,
    action: 'store',
    help: 'Source group (added to links)',
  });
  argparser.add_argument('--zkey', {
    nargs: 1,
    action: 'store',
    help: 'Source key (added to links)',
  });
  argparser.add_argument('--openinzotero', {
    action: 'store_true',
    help: 'Target zotero app (added to links)',
  });
  argparser.add_argument('--test', {
    action: 'store_true',
    help: 'Text xml to json conversion ref-by-ref. Helpful for debugging the xml to json conversion.',
  });
  argparser.set_defaults({ func: getFuncName(subCmdName) });
});
subParsersMap.set('attach-note', function (subparsers, subCmdName) {
  const argparser = subparsers.add_parser(subCmdName, {
    help: 'Utility function: Attach note to item',
  });
  argparser.set_defaults({ func: getFuncName(subCmdName) });
  argparser.add_argument('--key', {
    action: 'store',
    nargs: 1,
    help: 'The item key to which the note is attached.',
  });
  // TODO: Allow file argument (html file)
  /*argparser.add_argument("--file", {
        "action": "store_true",
        "help": "HELPTEXT"
      }); */
  argparser.add_argument('--notetext', {
    action: 'store',
    help: 'The text of the note',
  });
  argparser.add_argument('--notefile', {
    action: 'store',
    help: 'The text of the note',
  });
  argparser.add_argument('--tags', {
    nargs: '*',
    action: 'store',
    help: 'Tags to be attached to the note',
  });
});

// TODO: Fix help text and text function.
subParsersMap.set('getValue', function (subparsers, subCmdName) {
  const argparser = subparsers.add_parser(subCmdName, { help: 'HELPTEXT' });
  argparser.set_defaults({ func: getFuncName(subCmdName) });
  argparser.add_argument('--switch', {
    action: 'store_true',
    help: 'HELPTEXT',
  });
  argparser.add_argument('--arguments', {
    nargs: '*',
    action: 'store',
    help: 'HELPTEXT',
  });
});

// TODO: Fix help text and text function.
subParsersMap.set('collectionName', function (subparsers, subCmdName) {
  const argparser = subparsers.add_parser(subCmdName, {
    help: 'HELPTEXT',
  });
  argparser.set_defaults({ func: getFuncName(subCmdName) });
  argparser.add_argument('--switch', {
    action: 'store_true',
    help: 'HELPTEXT',
  });
  argparser.add_argument('--arguments', {
    nargs: '*',
    action: 'store',
    help: 'HELPTEXT',
  });
});

// TODO: Fix help text and text function.
subParsersMap.set('amendCollection', function (subparsers, subCmdName) {
  const argparser = subparsers.add_parser(subCmdName, {
    help: 'HELPTEXT',
  });
  argparser.set_defaults({ func: getFuncName(subCmdName) });
  argparser.add_argument('--switch', {
    action: 'store_true',
    help: 'HELPTEXT',
  });
  argparser.add_argument('--arguments', {
    nargs: '*',
    action: 'store',
    help: 'HELPTEXT',
  });
});

subParsersMap.set('__get', function (subparsers, subCmdName) {
  const argparser = subparsers.add_parser(subCmdName, {
    help: "Expose 'get'. Make a direct query to the API using 'GET uri'.",
  });
  argparser.set_defaults({ func: getFuncName(subCmdName) });
  argparser.add_argument('--root', {
    action: 'store_true',
    help: 'TODO: document',
  });
  argparser.add_argument('uri', { nargs: '+', help: 'TODO: document' });
});

subParsersMap.set('__post', function (subparsers, subCmdName) {
  const argparser = subparsers.add_parser(subCmdName, {
    help: "Expose 'post'. Make a direct query to the API using 'POST uri [--data data]'.",
  });
  argparser.set_defaults({ func: getFuncName(subCmdName) });
  argparser.add_argument('uri', { nargs: 1, help: 'TODO: document' });
  argparser.add_argument('--data', {
    required: true,
    help: 'Escaped JSON string for post data',
  });
});

subParsersMap.set('__put', function (subparsers, subCmdName) {
  const argparser = subparsers.add_parser(subCmdName, {
    help: "Expose 'put'. Make a direct query to the API using 'PUT uri [--data data]'.",
  });
  argparser.set_defaults({ func: getFuncName(subCmdName) });
  argparser.add_argument('uri', { nargs: 1, help: 'TODO: document' });
  argparser.add_argument('--data', {
    required: true,
    help: 'Escaped JSON string for post data',
  });
});

subParsersMap.set('__patch', function (subparsers, subCmdName) {
  const argparser = subparsers.add_parser(subCmdName, {
    help: "Expose 'patch'. Make a direct query to the API using 'PATCH uri [--data data]'.",
  });
  argparser.set_defaults({ func: getFuncName(subCmdName) });
  argparser.add_argument('uri', { nargs: 1, help: 'TODO: document' });
  argparser.add_argument('--data', {
    required: true,
    help: 'Escaped JSON string for post data',
  });
  argparser.add_argument('--version', {
    required: true,
    help: 'Version of Zotero record (obtained previously)',
  });
});

subParsersMap.set('__delete', function (subparsers, subCmdName) {
  const argparser = subparsers.add_parser(subCmdName, {
    help: "Expose 'delete'. Make a direct delete query to the API using 'DELETE uri'.",
  });
  argparser.set_defaults({ func: getFuncName(subCmdName) });
  argparser.add_argument('uri', { nargs: '+', help: 'Request uri' });
});

subParsersMap.set('key', function (subparsers, subCmdName) {
  const argparser = subparsers.add_parser(subCmdName, {
    help: 'Show details about an API key. (API: /keys )',
  });
  argparser.set_defaults({ func: getFuncName(subCmdName) });
  argparser.add_argument('--key', {
    nargs: 1,
    help: 'Provide the API key. Otherwise the API key given in the config is used. API: /keys',
  });
  argparser.add_argument('--groups', {
    action: 'store_true',
    help: 'Show groups available to this key (API: /users/<userID>/groups)',
  });
  argparser.add_argument('--terse', {
    action: 'store_true',
    help: 'Produce a simplified listing of groups',
  });
});

subParsersMap.set('collections', function (subparsers, subCmdName) {
  const argparser = subparsers.add_parser(subCmdName, {
    help: 'Retrieve sub-collections and create new collections.',
  });
  argparser.set_defaults({ func: getFuncName(subCmdName) });
  argparser.add_argument('--top', {
    action: 'store_true',
    help: 'Show only collection at top level.',
  });

  argparser.add_argument('--recursive', {
    action: 'store_true',
    help: 'Show all the child collections and sub-collections of collection with key recursively.',
  });
  argparser.add_argument('--key', {
    nargs: 1,
    help: 'Show all the child collections of collection with key. You can provide the key as zotero-select link (zotero://...) to also set the group-id.',
  });
  argparser.add_argument('--create-child', {
    nargs: '*',
    help: 'Create child collections of key (or at the top level if no key is specified) with the names specified.',
  });
  argparser.add_argument('--json', {
    action: 'store',
    help: 'Provide output in json format E.g --json Items.json',
  });
});

subParsersMap.set('collection', function (subparsers, subCmdName) {
  const argparser = subparsers.add_parser(subCmdName, {
    help: "Retrieve collection information, display tags, add/remove items. (API: /collections/KEY or /collections/KEY/tags). (Note: Retrieve items is a collection: use 'items --collection KEY'.) ",
  });
  argparser.set_defaults({ func: getFuncName(subCmdName) });
  argparser.add_argument('--key', {
    nargs: 1,
    help: 'The key of the collection (required). You can provide the key as zotero-select link (zotero://...) to also set the group-id.',
  });
  argparser.add_argument('--tags', {
    action: 'store_true',
    help: 'Display tags present in the collection.',
  });
  argparser.add_argument('itemkeys', {
    nargs: '*',
    help: 'Item keys for items to be added or removed from this collection.',
  });
  argparser.add_argument('--add', {
    nargs: '*',
    help: "Add items to this collection. Note that adding items to collections with 'item --addtocollection' may require fewer API queries. (Convenience method: patch item->data->collections.)",
  });
  argparser.add_argument('--remove', {
    nargs: '*',
    help: "Convenience method: Remove items from this collection. Note that removing items from collections with 'item --removefromcollection' may require fewer API queries. (Convenience method: patch item->data->collections.)",
  });
});

subParsersMap.set('db', function (subparsers, subCmdName) {
  const argparser = subparsers.add_parser(subCmdName, {
    help: "Manage locally synced version of your library'.) ",
  });
  argparser.set_defaults({ func: getFuncName(subCmdName) });
  argparser.add_argument('database', {
    action: 'store',
    help: 'Name of database to use for local syncing',
  });
  argparser.add_argument('--groupid', {
    action: 'store',
    type: 'int',
    help: 'get backup of specified group',
  });
  argparser.add_argument('--sync', {
    action: 'store_true',
    help: 'Sync online library in local database',
  });

  argparser.add_argument('--lookup', {
    action: 'store_true',
    help: 'Lookup records in local db',
  });

  argparser.add_argument('--keys', {
    nargs: '*',
    help: 'Keys to perform lookup on local db',
  });

  argparser.add_argument('--export-json', {
    action: 'store',
    help: 'export records from local db to given file as json, note: the records in local db may not have latest changes as online library, pass --sync to make sure that local db is synced before exporting.',
  });

  argparser.add_argument('--demon', {
    action: 'store',
    help: 'run sync as cron job, you can specify any valid cron pattern',
  });

  argparser.add_argument('--errors', {
    action: 'store_true',
    help: "Search any key where children and referencedBy aren't equal",
  });
  argparser.add_argument('--lockfile', {
    action: 'store',
    default: 'sync.lock',
    help: 'run sync as cron job, you can specify any valid cron pattern',
  });

  argparser.add_argument('--lock-timeout', {
    action: 'store',
    help: 'Number of seconds to wait before resetting the lock',
  });
  argparser.add_argument('--websocket', {
    action: 'store_true',
    help: 'Enable websocket for sync',
  });
  argparser.add_argument('--no-archive', {
    action: 'store_false',
    default: true,
    help: 'instead of updating the existing records and lost old changes , archive the old records then create new records (enabled by default)',
  });
});

subParsersMap.set('resolve', function (subparsers, subCmdName) {
  const argparser = subparsers.add_parser(subCmdName, {
    help: 'Resolve a Zotero Select link (zotero://...) to a key.',
  });
  argparser.set_defaults({ func: getFuncName(subCmdName) });
  argparser.add_argument('--file', {
    action: 'store',
    help: 'The database path',
  });
  argparser.add_argument('--groupid', {
    action: 'store',
    help: 'The group id',
  });
  // add array of keys
  argparser.add_argument('--keys', {
    nargs: '*',
    help: 'The keys to resolve',
  });
});

subParsersMap.set('deduplicate', function (subparsers, subCmdName) {
  const argparser = subparsers.add_parser(subCmdName, {
    help: 'Deduplicate items in a collection.',
  });
  argparser.set_defaults({ func: getFuncName(subCmdName) });

  argparser.add_argument('--mode', {
    choices: ['identical', 'same_doi', 'identical_in_several_fields', 'identical_in_lowercase'],
  });
  argparser.add_argument('--collection', {
    action: 'store',
    help: 'The collection to deduplicate',
  });
});

subParsersMap.set('movetocollection', function (subparsers, subCmdName) {
  const argparser = subparsers.add_parser(subCmdName, {
    help: 'move items from deduplicate json file to provided collection.',
  });
  argparser.set_defaults({ func: getFuncName(subCmdName) });

  argparser.add_argument('--collection', {
    action: 'store',
    required: true,
    help: 'The collection to move items to',
  });
  argparser.add_argument('--file', {
    action: 'store',
    required: true,
    help: 'The json file to read items from , this file is generated by deduplicate command',
  });
});

subParsersMap.set('merge', function (subparsers, subCmdName) {
  const argparser = subparsers.add_parser(subCmdName, {
    help: 'Deduplicate items in a collection.',
  });
  argparser.set_defaults({ func: getFuncName(subCmdName) });

  argparser.add_argument('--data', {
    action: 'store',
    help: 'The data to merge only accept json format',
    required: true,
  });
  argparser.add_argument('--options', {
    choices: ['identical', 'same_doi', 'identical_in_several_fields', 'identical_in_lowercase'],
    required: true,
  });
});

subParsersMap.set('find-empty-items', function (subparsers, subCmdName) {
  const argparser = subparsers.add_parser(subCmdName, {
    help: 'Deduplicate items in a collection.',
  });
  argparser.set_defaults({ func: getFuncName(subCmdName) });

  argparser.add_argument('--delete', {
    action: 'store_true',
    help: 'delete empty items',
  });
  argparser.add_argument('--output', {
    action: 'store',
    help: 'store the empty items result in json file default is ./empty_items.json',
  });
  argparser.add_argument('--onlykeys', {
    action: 'store_true',
    help: "store only keys of empty items it's required to use with --output",
  });
});

subParsersMap.set('get-ids', function (subparsers, subCmdName) {
  const argparser = subparsers.add_parser(subCmdName, {
    help: 'Get the ids of the items or a collection.',
  });
  argparser.set_defaults({ func: getFuncName(subCmdName) });

  argparser.add_argument('--key', {
    action: 'store',
    help: 'The ids of the items or collection.',
    required: true,
  });
});

export function configAllParsers(subparsers) {
  subParsersMap.forEach((subparserFn, key) => {
    subparserFn(subparsers, key);
  });
}
