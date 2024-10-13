import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AppConfig from 'constants/app-config';
import { CSC_Country_State } from 'shared';

interface GetCityByStateCountry {
  country_iso: string;
  state_iso: string;
}

/* https://countrystatecity.in/ */
export const geoApi = createApi({
  reducerPath: 'geoApi',
  baseQuery: fetchBaseQuery({
    baseUrl: AppConfig.geo_api,
    prepareHeaders: (headers) => {
      headers.set(
        'X-CSCAPI-KEY',
        process.env.REACT_APP_CSC_API_KEY ?? 'API_KEY'
      );
      return headers;
    }
  }),
  tagTypes: ['CountryList', 'StateList', 'CityList'],
  endpoints: (builder) => ({
    getAllCountries: builder.query<CSC_Country_State[], void>({
      query: () => '/',
      providesTags: ['CountryList'],
      transformErrorResponse: (response: { status: string | number }) =>
        response.status
    }),
    getStatesByCountry: builder.query<CSC_Country_State[], string>({
      query: (country_iso: string) => `/${country_iso}/states`,
      providesTags: (result, error, arg) => [{ type: 'StateList', id: arg }],
      transformErrorResponse: (response: { status: string | number }) =>
        response.status
    }),
    getCitiesByStatesOfCountry: builder.query<
      CSC_Country_State[],
      GetCityByStateCountry
    >({
      query: ({ country_iso, state_iso }: GetCityByStateCountry) =>
        `/${country_iso}/states/${state_iso}/cities`,
      providesTags: (result, error, arg) => [
        { type: 'CityList', id: arg.state_iso }
      ],
      transformErrorResponse: (response: { status: string | number }) =>
        response.status
    })
  })
});

export const {
  useGetAllCountriesQuery,
  useLazyGetStatesByCountryQuery,
  useLazyGetCitiesByStatesOfCountryQuery
} = geoApi;
