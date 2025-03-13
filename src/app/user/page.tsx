"use client";
import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import PaginatedTicketList from "@/app/components/PaginatedTicketList";
import axios from "axios";
import { Box, Typography } from "@mui/material";

type TicketStatusType = "Abierto" | "En progreso" | "Cerrado";

interface Ticket {
  id_ticket: string;
  description: string;
  status: TicketStatusType;
}

export default function UserTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const getTickets = async (userId: string) => {
    try {
      const response = await axios.get(`http://localhost:7001/user/${userId}/tickets?page=${page}`);
      setTickets(response.data.data.rows);
      setCount(response.data.data.count);
    } catch (error) {
      setError("Error al obtener los tickets");
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      getTickets(userId);
    } else {
      setError("No se encontró el ID del usuario en el local storage.");
    }
  }, [page]);

  return (
    <Box className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <Box className="p-6">
        <Typography variant="h4" fontWeight="bold" mb={4}>
          Lista de Tickets (Usuario)
        </Typography>
        {error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <PaginatedTicketList tickets={tickets} count={count} handlePageChange={handleChange} page={page} />
        )}
      </Box>
    </Box>
  );
}