import algoliasearch from 'algoliasearch/lite';
import { SearchResponse } from '@algolia/client-search';
import AlgoliaConfig from 'constants/algolia-config';
import { GroceryItemHit } from 'shared';

const searchClient = algoliasearch(
  AlgoliaConfig.APP_ID,
  AlgoliaConfig.API_KEY
).initIndex(AlgoliaConfig.DEFAULT_INDEX);

export const fetchAlgoliaData = async (
  query: string,
  hitsPerPage?: number,
  page?: number,
  facetFilters?: string[],
  numericFilters?: string[]
): Promise<SearchResponse<GroceryItemHit> | null> => {
  try {
    const searchResult = await searchClient.search<GroceryItemHit>(query, {
      attributesToRetrieve: ['*'],
      facets: ['*'],
      filters: '',
      numericFilters,
      hitsPerPage: hitsPerPage ?? AlgoliaConfig.CONFIG.hitsPerPage.searchbar,
      page: page ?? 0,
      facetFilters: ['brand:BB Royal'],
      clickAnalytics: true,
      getRankingInfo: true,
    });
    return searchResult;
  } catch (err) {
    console.error('Unable to get products from algolia', err);
    return null;
  }
};
