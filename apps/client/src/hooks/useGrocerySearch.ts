import { useEffect, useState } from 'react';
import algoliasearch from 'algoliasearch/lite';
import { SearchResponse } from '@algolia/client-search';
import AlgoliaConfig from 'constants/algolia-config';
import { GroceryItemHit } from 'shared';
import { categorizeFacets, generateFacetFilters } from 'utils';

interface UseGroceryResponse {
  isFetching: boolean;
  searchResult: SearchResponse<GroceryItemHit>;
}

const searchClient = algoliasearch(
  AlgoliaConfig.APP_ID,
  AlgoliaConfig.API_KEY
).initIndex(AlgoliaConfig.DEFAULT_INDEX);

const defaultSearchResult = {
  nbHits: 0,
  nbPages: 0,
  hits: [],
  facets: {},
  query: '',
  page: 0,
  hitsPerPage: AlgoliaConfig.CONFIG.hitsPerPage.searchbar,
  processingTimeMS: 0,
  exhaustiveNbHits: false,
  params: '',
};

export const useGrocerySearch = (
  query: string,
  hitsPerPage?: number,
  page?: number,
  facetFilters?: string[],
  numericFilters?: string[]
): UseGroceryResponse => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [searchResult, setSearchResult]
    = useState<SearchResponse<GroceryItemHit>>(defaultSearchResult);

  useEffect(() => {
    const getSearchResult = async () => {
      setIsFetching(true);
      try {
        const searchResponse = await searchClient.search<GroceryItemHit>(
          query,
          {
            attributesToRetrieve: ['*'],
            facets: ['*'],
            filters: '',
            numericFilters: numericFilters ?? [],
            hitsPerPage:
              hitsPerPage ?? AlgoliaConfig.CONFIG.hitsPerPage.searchbar,
            page: page ?? 0,
            facetFilters: facetFilters
              ? generateFacetFilters(categorizeFacets(facetFilters, true))
              : [],
            clickAnalytics: true,
            getRankingInfo: true,
          }
        );
        setSearchResult(searchResponse);
      } catch (err) {
        console.error('Unable to get products from algolia', err);
      } finally {
        setIsFetching(false);
      }
    };
    getSearchResult();
  }, [query, numericFilters, facetFilters, page, hitsPerPage]);

  return {
    isFetching,
    searchResult,
  };
};
