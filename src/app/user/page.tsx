"use client";
import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import PaginatedTicketList from "@/app/components/PaginatedTicketList";
import axios from "axios";
import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const getTickets = async (userId: string | null) => {
    try {
      const response = await axios.get(`http://localhost:7001/user/${userId || "defaultUser"}/tickets?page=${page}`);
      setTickets(response.data.data.rows);
      setCount(response.data.data.count);
      setError(null); // Limpiar errores previos
    } catch (error) {
      console.error("Error al obtener los tickets:", error);
      setError("Error al obtener los tickets");
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    getTickets(userId); // Llamar a la función con el userId o null si no existe
  }, [page]);

  const handleCreateTicket = () => {
    router.push("/user/create-ticket"); // Ruta para crear un ticket
  };

  return (
    <Box className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <Box className="p-6">
        <Typography variant="h4" fontWeight="bold" mb={4}>
          Lista de Tickets (Usuario)
        </Typography>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateTicket}
            sx={{ mb: 4 }}
          >
            Crear Ticket
          </Button>
          <PaginatedTicketList tickets={tickets} count={count} handlePageChange={handleChange} page={page} />
        </>
      </Box>
    </Box>
  );
}