"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import TicketForm from "../components/TicketForm";
import PaginatedTicketList from "../components/PaginatedTicketList";
import axios from "axios";

export default function Home() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  
  const handleAddTicket = (ticket: Ticket) => {
    setTickets([...tickets, ticket]);
  };
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const getTickets = async () => {
    try { 
      const response = await axios.get(`http://localhost:7001/tickets?page=${page}`);

      setTickets(response.data.data.rows);
      setCount(response.data.data.count);
    } catch (error) {
      console.error("Error al obtener los tickets:", error);
    }
  };

  // Cargar los tickets al montar el componente
  useEffect(() => {
    getTickets();
  }, [page]);

  return (
    <>
      <Navbar />
      <main className="flex flex-col lg:flex-row gap-4 p-4 bg-white min-h-screen">
        {/* Lista de Tickets */}
        <div className="w-full lg:w-1/3 border p-4 rounded shadow flex-grow">
          <PaginatedTicketList tickets={tickets} count = {count} handlePageChange={handleChange} page={page} />
        </div>

        {/* Formulario de creación de Tickets */}
        <div className="w-full lg:w-1/3 border p-4 rounded shadow flex-grow mt-4 lg:mt-0">
          <TicketForm onSubmit={handleAddTicket} />
        </div>
      </main>
    </>
  );
}