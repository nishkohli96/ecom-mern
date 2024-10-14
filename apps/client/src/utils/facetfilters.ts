import AlgoliaConfig from 'constants/algolia-config';
import { FilterCategories } from 'shared';

export function categorizeFacets(
  filters: string[],
  concatFacet?: boolean
): FilterCategories {
  const result: FilterCategories = {
    brand: [],
    category: [],
    sub_category: []
  };
  filters.forEach((el) => {
    const facet = el.split(':');
    if (facet[0] === AlgoliaConfig.FACET_ATTRIBUTES.brand) {
      result.brand.push(concatFacet ? el : facet[1]);
    } else if (facet[0] === AlgoliaConfig.FACET_ATTRIBUTES.category) {
      result.category.push(concatFacet ? el : facet[1]);
    } else if (facet[0] === AlgoliaConfig.FACET_ATTRIBUTES.sub_category) {
      result.sub_category.push(concatFacet ? el : facet[1]);
    }
  });
  return result;
}

export function generateFacetFilters(obj: FilterCategories): Array<string[]> {
  const filtersArray = Object.values(obj);
  return filtersArray;
}
