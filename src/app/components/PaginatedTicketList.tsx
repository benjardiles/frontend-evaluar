import React, { useState } from 'react';
import { Pagination } from '@mui/material';
import TicketList from './TicketList';

interface PaginatedTicketListProps {
  tickets: Ticket[];
  count: number;
  handlePageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  page: number;
}

const PaginatedTicketList: React.FC<PaginatedTicketListProps> = ({ tickets, count, handlePageChange, page }) => {
  const ticketsPerPage = 10;
  const pageCount = Math.ceil(count / ticketsPerPage);

  return (
    <div>
      <TicketList tickets={tickets} />
      <Pagination count={pageCount} page={page} onChange={handlePageChange} />
    </div>
  );
};

export default PaginatedTicketList;