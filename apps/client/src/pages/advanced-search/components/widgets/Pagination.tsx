import { Fragment } from 'react';
import Pagination from '@mui/material/Pagination';

interface PaginationWidgetProps {
  currentPage: number;
  nbPages: number;
  onPageChange: (page: number) => void;
}

export const PaginationWidget = ({
  currentPage,
  nbPages,
  onPageChange,
}: PaginationWidgetProps) => {
  /**
   *  Pagination numbering for MUI starts from 1 whereas
   *  for algolia it starts from zero.
   */
  return (
    <Fragment>
      {nbPages > 0 && (
        <Fragment>
          <div className="d-flex justify-content-center mt-4">
            <Pagination
              page={currentPage + 1}
              count={nbPages}
              color="primary"
              showFirstButton
              showLastButton
              onChange={(_, page: number) => onPageChange(page - 1)}
            />
          </div>
          <div className="text-center mt-3">
            Page {currentPage + 1} of {nbPages}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};
