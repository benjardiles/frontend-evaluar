"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/app/components/Navbar";
import { 
  Grid, Card, CardContent, Typography, Button, 
  LinearProgress, TextField, IconButton, Box, Divider 
} from "@mui/material";
import { 
  Chat as ChatIcon, AttachFile as AttachFileIcon, 
  Send as SendIcon, CheckCircle, AccessTime, Close as CloseIcon 
} from "@mui/icons-material";

type TicketStatusType = "Abierto" | "En progreso" | "Cerrado";

interface Ticket {
  id_ticket: number;
  status: TicketStatusType;
  description: string;
  file_path: string | null;
  id_user: string;
  createdAt: string;
  updatedAt: string;
}

// Función para obtener el progreso basado en el estado
const getProgress = (status: TicketStatusType) => {
  switch (status) {
    case "Abierto": return 20;
    case "En progreso": return 60;
    case "Cerrado": return 100;
    default: return 0;
  }
};

export default function TicketDetails() {
  const pathname = usePathname();
  const id = pathname?.split("/").pop();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false); // Estado para mostrar/ocultar chat

  useEffect(() => {
    if (!id) return;
    const fetchTicket = async () => {
      try {
        const response = await axios.get(`http://localhost:7001/tickets/${id}`);
        if (response.data.error) throw new Error(response.data.message || "Error al obtener el ticket");
        setTicket(response.data.data);
      } catch (err) {
        setError((err as Error).message);
      }
    };
    fetchTicket();
  }, [id]);

  return (
    <Box className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <Grid container spacing={4} justifyContent="center" className="p-6">
        {error ? (
          <Typography color="error">Error: {error}</Typography>
        ) : !ticket ? (
          <Typography color="textPrimary">Cargando ticket...</Typography>
        ) : (
          <>
            {/* Tarjeta de Detalles del Ticket */}
            <Grid item xs={12} md={6}>
              <Card elevation={3} sx={{ p: 2 }}>
                <CardContent>
                  <Typography variant="h4" fontWeight="bold">Detalles del Ticket</Typography>
                  <Typography variant="h5" color="primary" fontWeight="bold">
                    {ticket.description}
                  </Typography>
                  <Typography>ID: {ticket.id_ticket}</Typography>
                  <Typography>
                    Fecha de creación: {new Date(ticket.createdAt).toLocaleString()}
                  </Typography>

                  {/* Asignado a */}
                  <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                    Asignado a:
                  </Typography>
                  <Typography>{ticket.id_user}</Typography>

                  {/* Estado del Ticket */}
                  <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                    Estado del Ticket:
                  </Typography>
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item>
                      {ticket.status === "Cerrado" ? (
                        <CheckCircle color="success" />
                      ) : (
                        <AccessTime color="warning" />
                      )}
                    </Grid>
                    <Grid item>
                      <Typography>{ticket.status}</Typography>
                    </Grid>
                  </Grid>

                  {/* Barra de progreso */}
                  <LinearProgress
                    variant="determinate"
                    value={getProgress(ticket.status)}
                    sx={{
                      mt: 1,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "#e0e0e0",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: 
                          ticket.status === "Abierto" ? "#ff9800" : 
                          ticket.status === "En progreso" ? "#2196f3" : 
                          "#4caf50",
                      },
                    }}
                  />

                  {/* Botón de Chat */}
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<ChatIcon />}
                    sx={{ mt: 3, width: "100%" }}
                    onClick={() => setIsChatOpen(!isChatOpen)}
                  >
                    {isChatOpen ? "Cerrar Chat" : "Abrir Chat"}
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Mostrar Chat solo si está abierto */}
            {isChatOpen && (
              <Grid item xs={12} md={6}>
                <Card elevation={3} sx={{ p: 2 }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h5" fontWeight="bold">
                        Chat del Ticket #{ticket.id_ticket}
                      </Typography>
                      <IconButton color="error" onClick={() => setIsChatOpen(false)}>
                        <CloseIcon />
                      </IconButton>
                    </Box>
                    <Divider sx={{ my: 2 }} />

                    {/* Mensajes del Chat */}
                    <Box sx={{ border: "1px solid #ddd", borderRadius: 2, p: 2, minHeight: 150, bgcolor: "#f5f5f5" }}>
                      <Typography color="textSecondary" textAlign="center">
                        No hay mensajes aún.
                      </Typography>
                    </Box>

                    {/* Input de Mensaje */}
                    <Grid container spacing={1} alignItems="center" sx={{ mt: 3 }}>
                      <Grid item>
                        <IconButton color="primary">
                          <AttachFileIcon />
                        </IconButton>
                      </Grid>
                      <Grid item xs>
                        <TextField
                          fullWidth
                          variant="outlined"
                          placeholder="Escribe tu mensaje..."
                          size="small"
                        />
                      </Grid>
                      <Grid item>
                        <IconButton color="success">
                          <SendIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </>
        )}
      </Grid>
    </Box>
  );
}