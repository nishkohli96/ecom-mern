import algoliasearch from 'algoliasearch';
import { ENV_VARS } from 'app-constants';
import ALGOLIA_CONFIG from './constants';

const algoliaClient = algoliasearch(
  ENV_VARS.algolia.app_id,
  ENV_VARS.algolia.write_key
);

export const algoliaIndex = algoliaClient.initIndex(
  ALGOLIA_CONFIG.default_index
);
