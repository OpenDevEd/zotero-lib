# zotero-lib

A powerful TypeScript library and CLI tool for interacting with the Zotero API. Part of the OpenDevEd zotzen ecosystem for managing academic libraries.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [CLI Commands](#cli-commands)
- [Library Usage](#library-usage)
- [Configuration](#configuration)
- [Development](#development)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)

## Installation

### As a CLI Tool (Global)

```bash
npm install -g zotero-lib
# or
yarn global add zotero-lib
```

### As a Library (Local)

```bash
npm install zotero-lib
# or
yarn add zotero-lib
```

### From Source

```bash
git clone https://github.com/OpenDevEd/zotero-lib.git
cd zotero-lib
npm install
npm run build
```

## Quick Start

### CLI Basics

```bash
# Show help
zotero-lib -h
zotero-lib --help

# Show version
zotero-lib -v

# Get items from a group
zotero-lib items --group-id 12345 --api-key YOUR_API_KEY --filter '{"limit": 10}'

# Create an item
zotero-lib create --group-id 12345 --api-key YOUR_API_KEY --items '{"title": "My Book", "itemType": "book"}'
```

### Environment Variables

Set these for convenience (avoids passing `--api-key` every time):

```bash
export ZOTERO_API_KEY="your-api-key-here"
export ZOTERO_GROUP_ID="12345"
```

Or create a `.env` file:

```
ZOTERO_API_KEY=your-api-key-here
ZOTERO_GROUP_ID=12345
```

## CLI Commands

### Item Management

#### Create Items

```bash
# From file containing JSON
zotero-lib create --files items.json

# From command line JSON
zotero-lib create --items '{"title": "Book Title", "itemType": "book"}'

# Multiple items
zotero-lib create --items '{"title": "Book 1"}' '{"title": "Book 2"}'
```

#### Update Items

```bash
# Update by key
zotero-lib update --key ABC123 --json '{"title": "Updated Title"}'

# Replace entire item
zotero-lib update --replace --key ABC123 --json '{"title": "New Item", "itemType": "book"}'

# From file
zotero-lib update --key ABC123 --file items.json
```

#### Get Items

```bash
# Single item
zotero-lib item --key ABC123

# Multiple items with filters
zotero-lib items --filter '{"limit": 50, "start": 0}'

# Top-level items only (no attachments/notes)
zotero-lib items --top

# Items in specific collection
zotero-lib items --collection ABC123
```

#### Delete Items

```bash
# Move to trash
zotero-lib delete --key ABC123

# Permanent delete
zotero-lib delete --key ABC123 --permanent
```

### Collection Management

```bash
# List collections
zotero-lib collections --group-id 12345

# Create collection
zotero-lib collection --group-id 12345 --name "My Collection"

# Update collection
zotero-lib update-collection --key ABC123 --name "New Name"

# Delete collection
zotero-lib delete-collection --key ABC123
```

### Tag Management

```bash
# List tags
zotero-lib tags --group-id 12345

# Get items by tag
zotero-lib items --tag "important"
```

### Attachments

```bash
# Add attachment
zotero-lib attachment --key ABC123 --addfiles file.pdf

# Attach link
zotero-lib attach-link --key ABC123 --url "https://example.com"

# Attach note
zotero-lib attach-note --key ABC123 --note "This is a note"
```

### DOI Operations

```bash
# Get DOI for an item
zotero-lib get-doi --key ABC123

# Update DOI
zotero-lib update-doi --key ABC123 --doi "10.1234/example"
```

### Field Operations

```bash
# Get field value
zotero-lib field --key ABC123 --field title

# Set field value
zotero-lib field --key ABC123 --field title --value "New Title"

# Get extra field
zotero-lib field --key ABC123 --extra --field customField
```

### Database Sync

Sync your Zotero library locally using SQLite:

```bash
# Initial sync
zotero-lib db backup.db --sync --group-id 12345

# Incremental sync (only fetches changes since last sync)
zotero-lib db backup.db --sync

# Export to JSON
zotero-lib db backup.db --export-json=backup.json

# Lookup items locally
zotero-lib db backup.db --lookup --keys ABC123,DEF456

# Scheduled sync (daemon mode)
zotero-lib db backup.db --sync --daemon="0 * * * *"  # Every hour

# Find inconsistent items
zotero-lib db backup.db --errors
```

### Merge & Deduplicate

#### Intelligent Merge (Recommended)

```bash
# Merge duplicates with intelligent strategy
zotero-lib merge --group-id 12345 --data duplicates.json --strategy intelligent_fill

# Available strategies:
#   - intelligent_fill (default): Fill empty fields from duplicates
#   - keep_oldest: Preserve oldest item
#   - keep_newest: Preserve newest item
```

#### Deduplicate

```bash
# Find duplicates
zotero-lib deduplicate --group-id 12345 --options identical

# With output file
zotero-lib deduplicate --group-id 12345 --output duplicates.json
```

### Other Commands

```bash
# Get item types
zotero-lib types --group-id 12345

# List groups
zotero-lib groups

# Search items
zotero-lib searches --group-id 12345

# Get library fields
zotero-lib fields --group-id 12345

# Create bibliography
zotero-lib bibliography --group-id 12345 --style apa

# Get item template
zotero-lib TEMPLATE --item-type book
```

## Library Usage

### Import the Library

```typescript
import { Zotero } from 'zotero-lib';
```

### Initialize

```typescript
const zotero = new Zotero({
  apiKey: 'your-api-key',
  groupId: 12345
});
```

### Fetch Items

```typescript
// Get all items
const items = await zotero.getItems();

// Get items with filters
const items = await zotero.getItems({
  limit: 50,
  start: 0,
  collection: 'collection-key',
  tag: 'important'
});

// Get single item
const item = await zotero.getItem('ABC123');
```

### Create Items

```typescript
const newItem = await zotero.createItem({
  title: 'My Book',
  itemType: 'book',
  creators: [{
    creatorType: 'author',
    firstName: 'John',
    lastName: 'Doe'
  }]
});
```

### Update Items

```typescript
await zotero.updateItem('ABC123', {
  title: 'Updated Title'
});
```

### Merge Items

```typescript
import { merge_items, MergeStrategy } from 'zotero-lib/build/utils/merge';

const result = await merge_items(
  groupId,
  itemKeys,
  MergeStrategy.INTELLIGENT_FILL
);

console.log(result);
```

## Configuration

### Config File

Create `zotero.config.json` in your project root:

```json
{
  "apiKey": "your-api-key",
  "groupId": 12345,
  "libraryType": "group"
}
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `ZOTERO_API_KEY` | Your Zotero API key |
| `ZOTERO_GROUP_ID` | Default group ID |
| `ZOTERO_LIBRARY_TYPE` | 'user' or 'group' (default: 'user') |

## Development

### Setup

```bash
npm install
npm run build
```

### Available Scripts

```bash
# Development
npm run dev          # Run with ts-node

# Build
npm run build        # Build for production

# Test
npm test             # Run Jest tests
npm run legacy:test  # Run legacy tests

# Lint
npx eslint src/

# Type checking
npx tsc --noEmit

# Generate docs
npm run docs         # Generate TypeScript documentation

# Publish
npm run publish:patch  # Patch release
npm run publish:minor  # Minor release
npm run publish:major  # Major release
```

### Running Tests

```bash
# All tests
npm test

# Specific test file
npx jest tests/utils.test.ts

# With coverage
npm test -- --coverage
```

## API Reference

### Zotero Class

#### Constructor

```typescript
new Zotero(config: ZoteroConfig)
```

#### Methods

| Method | Description |
|--------|-------------|
| `getItems(options?)` | Fetch items from library |
| `getItem(key)` | Fetch single item |
| `createItem(item)` | Create new item |
| `updateItem(key, data)` | Update item |
| `deleteItem(key)` | Delete item |
| `getCollections()` | List collections |
| `createCollection(name, parent?)` | Create collection |
| `getTags()` | List tags |
| `getItemTypes()` | List item types |
| `getFields()` | List available fields |

### Merge Strategies

```typescript
enum MergeStrategy {
  INTELLIGENT_FILL = 'intelligent_fill',
  KEEP_OLDEST = 'keep_oldest',
  KEEP_NEWEST = 'keep_newest'
}
```

## Related Projects

This library is part of the OpenDevEd zotzen ecosystem:

- [zenodo-lib](https://github.com/opendeved/zenodo-lib) - Zenodo API library
- [zotzen-lib](https://github.com/opendeved/zotzen-lib) - Combined Zotero + Zenodo
- [zotzen-web](https://github.com/opendeved/zotzen-web) - Web interface

## License

ISC License - see [LICENSE](LICENSE) file for details.

## Credits

Originally built on [zotero-cli](https://github.com/OpenDevEd/zotero-cli) by [@bjohas](https://github.com/bjohas), [@retorquere](https://github.com/retorquere), and [@a1diablo](https://github.com/a1diablo).

---

For more details, see the [full documentation](docs/) or run `zotero-lib --help`.
