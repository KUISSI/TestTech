import React from "react";

interface Props {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}

const PaginationControls: React.FC<Props> = ({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}) => (
  <div className="pagination">
    <button
      onClick={onPrevious}
      disabled={currentPage === 1}
      className="btn btn-secondary"
    >
      Previous
    </button>

    <span className="page-info">
      Page {currentPage} of {totalPages}
    </span>

    <button
      onClick={onNext}
      disabled={currentPage === totalPages}
      className="btn btn-secondary"
    >
      Next
    </button>
  </div>
);

export default PaginationControls;
