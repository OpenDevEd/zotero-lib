import { crossrefContributorRole, crossrefPublisherXML } from './formatAsCrossRefXML';

describe('crossrefPublisherXML', () => {
  test('it should name the institution as publisher and institution', () => {
    const xml = crossrefPublisherXML('Open Development & Education');
    expect(xml).toContain('<publisher_name>Open Development &amp; Education</publisher_name>');
    expect(xml).toContain('<institution_name>Open Development &amp; Education</institution_name>');
  });

  test('it should leave both elements out when the item has no institution', () => {
    expect(crossrefPublisherXML(undefined)).toBe('');
    expect(crossrefPublisherXML('  ')).toBe('');
  });
});

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
