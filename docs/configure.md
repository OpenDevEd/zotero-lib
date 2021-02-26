```
public async configure(args, readconfigfile = false)
```
Called during initialisation.

INPUT:
```
args = {}    
```
or
```
args = {
  config: "zotero-lib.toml"
}
```
or
```
args = {
  user_id: "XXX",
  group_id: "123",
  library_type: "group",
  indent = 4,
  "api-key": "XXX"
} 
```
or
```
args = {
  zotero_user_id: "XXX",
  zotero_group_id: "123",
  zotero_library_type: "group",
  zotero_indent = 4,
  "zotero-api-key": "XXX"
} 
```
OUTPUT:
```
this.config = {
  user_id: "XXX",
  group_id: "123",
  library_type: "group",
  indent = 4,
  api_key: "XXX"
}
```