import { Suspense, useMemo } from 'react';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, Configure } from 'react-instantsearch';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useAppSelector, ThemeSelector } from 'redux-store';
import AppTheme from 'assets/styles/apptheme';
import { Loading, RootContainer } from 'shared';
import Routing from 'routes';
import AlgoliaConfig from 'constants/algolia-config';

const searchClient = algoliasearch(AlgoliaConfig.APP_ID, AlgoliaConfig.API_KEY);

function App() {
  const mode = useAppSelector(ThemeSelector);
  const theme = useMemo(() => createTheme(AppTheme(mode)), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RootContainer>
        <Suspense fallback={<Loading />}>
          <InstantSearch
            searchClient={searchClient}
            indexName={AlgoliaConfig.DEFAULT_INDEX}
            // insights
          >
            <Configure />
            <Routing />
          </InstantSearch>
        </Suspense>
      </RootContainer>
    </ThemeProvider>
  );
}

export default App;
