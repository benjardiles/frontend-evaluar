  "use client";
  import { usePathname } from "next/navigation";
  import { useEffect, useState } from "react";
  import axios from "axios";
  import Navbar from "@/app/components/Navbar";
  import Chat from "@/app/components/Chat";
  import { Box, Typography, Button, Grid, Card, CardContent, LinearProgress, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
  import { Chat as ChatIcon, CheckCircle, AccessTime } from "@mui/icons-material";
  
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
    const [newStatus, setNewStatus] = useState<TicketStatusType>("Abierto");
  
    useEffect(() => {
      if (!id) return;
      const fetchTicket = async () => {
        try {
          const response = await axios.get(`http://localhost:7001/tickets/${id}`);
          if (response.data.error) throw new Error(response.data.message || "Error al obtener el ticket");
          setTicket(response.data.data);
          setNewStatus(response.data.data.status);
        } catch (err) {
          setError((err as Error).message);
        }
      };
      fetchTicket();
    }, [id]);
  
    const handleStatusChange = async (ticketId: number, status: TicketStatusType) => {
      try {
        const response = await axios.put(`http://localhost:7001/tickets/${ticketId}`, {
          status: status
        });
        console.log("Ticket actualizado:", response.data);
        if (response.data.error) throw new Error(response.data.message || "Error al actualizar el estado del ticket");
        if (ticket) {
          setTicket({ ...ticket, status });
        }
      } catch (err) {
        setError((err as Error).message);
      }
    };
  
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
  
                    {/* Selector de Estado */}
                    <FormControl fullWidth sx={{ mt: 2 }}>
                      <InputLabel id="status-label">Estado</InputLabel>
                      <Select
                        labelId="status-label"
                        value={newStatus}
                        label="Estado"
                        onChange={(e) => setNewStatus(e.target.value as TicketStatusType)}
                      >
                        <MenuItem value="Open">Abierto</MenuItem>
                        <MenuItem value="In_Progress">En progreso</MenuItem>
                        <MenuItem value="Closed">Cerrado</MenuItem>
                      </Select>
                    </FormControl>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2 }}
                      onClick={() => handleStatusChange(ticket.id_ticket, newStatus)}
                    >
                      Actualizar Estado
                    </Button>
  
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
              {isChatOpen && <Chat ticketId={ticket.id_ticket} onClose={() => setIsChatOpen(false)} />}
            </>
          )}
        </Grid>
      </Box>
    );
  }