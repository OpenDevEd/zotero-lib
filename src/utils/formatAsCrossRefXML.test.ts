import { crossrefContributorRole } from './formatAsCrossRefXML';

describe('crossrefContributorRole', () => {
  test('it should keep roles the Crossref schema accepts', () => {
    expect(crossrefContributorRole('author')).toBe('author');
    expect(crossrefContributorRole('editor')).toBe('editor');
    expect(crossrefContributorRole('translator')).toBe('translator');
  });

  test('it should fall back to author for Zotero creator types Crossref rejects', () => {
    expect(crossrefContributorRole('presenter')).toBe('author');
    expect(crossrefContributorRole('contributor')).toBe('author');
    expect(crossrefContributorRole('cartographer')).toBe('author');
    expect(crossrefContributorRole(undefined)).toBe('author');
  });
});
