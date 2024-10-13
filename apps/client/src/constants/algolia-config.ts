const AlgoliaConfig = Object.freeze({
  APP_ID: process.env.REACT_APP_ALGOLIA_APP_ID ?? '',
  API_KEY: process.env.REACT_APP_ALGOLIA_SEARCH_API_KEY ?? '',
  DEFAULT_INDEX: 'big-basket',
  FACET_ATTRIBUTES: {
    brand: 'brand',
    category: 'category',
    sub_category: 'sub_category',
    defaultPrice: 'discount_price'
  },
  ALGOLIA_EVENTS: {
    click: 'click',
    conversion: 'conversion'
  },
  USER_EVENTS: {
    product_click: 'Product Clicked',
    product_purchased: 'Product Purchased'
  },
  CONFIG: {
    hitsPerPage: {
      search: 5,
      /* used in autocomplete in navbar */
      searchbar: 5,
      /* number of brand_name pills to show in homepage */
      brands_list: 40,
      /* Max items to fetch in refinement list */
      brand_categories: 10,
      /* Used in instantsearch configure */
      products: 18
    },
    search: {
      /** Enter atleast 2 chars to trigger search results */
      minCharInput: 2
    },
    productPage: {
      maxAllowedPurchase: 5
    }
  }
});

export default AlgoliaConfig;
