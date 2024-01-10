import type { BaseHit } from 'instantsearch.js';
import { GroceryItem } from '@ecom/mern-shared';
import AlgoliaConfig from 'constants/algolia-config';

export interface GroceryItemHit extends BaseHit, GroceryItem {}

export type FacetHit = Record<string, number>;

const facets = Object.values(AlgoliaConfig.FACET_ATTRIBUTES);
export type FacetAttribute = (typeof facets)[number];

export type FilterCategories = Record<FacetAttribute, string[]>;
