import { Fragment } from 'react';
import { useHits, usePagination } from 'react-instantsearch';
import Pagination from '@mui/material/Pagination';

const PaginationWidget = () => {
  const { hits } = useHits();
  const { currentRefinement, nbPages, refine } = usePagination();
  /**
   *  Pagination numbering for MUI starts from 1 whereas
   *  for algolia it starts from zero.
   */
  return (
    <Fragment>
      {hits.length > 0 && (
        <Fragment>
          <div className="d-flex justify-content-center mt-4">
            <Pagination
              page={currentRefinement + 1}
              count={nbPages}
              color="primary"
              showFirstButton
              showLastButton
              onChange={(_, page: number) => refine(page - 1)}
            />
          </div>
          <div className="text-center mt-3">
            Page
            {' '}
            {currentRefinement + 1}
            {' '}
            of
            {' '}
            {nbPages}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default PaginationWidget;
