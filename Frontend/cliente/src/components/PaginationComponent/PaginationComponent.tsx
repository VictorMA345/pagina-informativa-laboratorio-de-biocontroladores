import { Pagination, Container } from 'react-bootstrap';
import './PaginationComponent.css';

interface PaginationComponentProps {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  actions: any;
  filters: any;
}

export const PaginationComponent: React.FC<PaginationComponentProps> = ({
  currentPage,
  itemsPerPage,
  totalItems,
  actions,
  filters
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  const decreasePage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      actions({
        type: "SET_ITEM",
        rows: [],
        cantidad: itemsPerPage,
        pagina: newPage,
        itemCounts: totalItems,
        filters: filters
      });
    }
  };

  const increasePage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      actions({
        type: "SET_ITEM",
        rows: [],
        cantidad: itemsPerPage,
        pagina: newPage,
        itemCounts: totalItems,
        filters: filters
      });
    }
  };

  const goToFirstPage = () => {
    actions({
      type: "SET_ITEM",
      rows: [],
      cantidad: itemsPerPage,
      pagina: 1,
      itemCounts: totalItems,
      filters: filters
    });
  };

  const goToLastPage = () => {
    actions({
      type: "SET_ITEM",
      rows: [],
      cantidad: itemsPerPage,
      pagina: totalPages,
      itemCounts: totalItems,
      filters: filters
    });
  };

  const goToPage = (page: number) => {
    actions({
      type: "SET_ITEM",
      rows: [],
      cantidad: itemsPerPage,
      pagina: page,
      itemCounts: totalItems,
      filters: filters
    });
  };

  return (
    <Container className="page-index-container">
      <Pagination className="pagination">
        <Pagination.First onClick={goToFirstPage} disabled={currentPage === 1} />
        <Pagination.Prev onClick={decreasePage} disabled={currentPage === 1} />

        {pageNumbers.map((page) => (
          <Pagination.Item
            key={page}
            active={page === currentPage}
            onClick={() => goToPage(page)}
            className={page === currentPage ? 'active-page' : 'pagination-item'}
          >
            {page}
          </Pagination.Item>
        ))}

        <Pagination.Next
          onClick={increasePage}
          disabled={currentPage === totalPages}
        />
        <Pagination.Last
          onClick={goToLastPage}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </Container>
  );
};