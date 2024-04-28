import React from 'react';
import { Pagination } from '@mui/material';

const Paginations = ({ handlePrevious, handleNext, page, pageCount, setPage }) => {
  return (
    <>
      {
        pageCount > 0 &&
          <div className="pagination_div d-flex justify-content-end mx-5 mt-3">
            <Pagination
              count={pageCount}
              page={page}
              onChange={(event, value) => setPage(value)}
              color="primary"
              variant="outlined"
              shape="rounded"
            />
          </div>
      }
    </>
  );
}

export default Paginations;
