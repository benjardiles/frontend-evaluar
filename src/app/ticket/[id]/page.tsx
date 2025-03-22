"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/app/components/Navbar";
import { Box, Typography, Button, Grid, Card, CardContent, TextField, MenuItem, Select, CircularProgress } from "@mui/material";

type TicketStatusType = "Abierto" | "En progreso" | "Cerrado";

interface Ticket {
  id_ticket: number;
  status: TicketStatusType;
  description: string;
  file_path: string | null;
  idAdmin: string;
  createdAt: string;
  updatedAt: string;
}

interface Comentario {
  id_comentario: number;
  comentario: string;
  idAdmin: string;
  id_ticket: number;
  createdAt: string;
}

export default function TicketDetails() {
  const pathname = usePathname();
  const id = pathname?.split("/").pop();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [estado, setEstado] = useState<TicketStatusType>("Abierto");
  const [loading, setLoading] = useState(false);
  const [loadingComentario, setLoadingComentario] = useState(false);

  useEffect(() => {
    if (!id) return;

    const abortController = new AbortController();

    const fetchTicket = async () => {
      try {
        const response = await axios.get(`http://localhost:7001/tickets/${id}`, {
          signal: abortController.signal,
        });
        if (response.data.error) throw new Error(response.data.message || "Error al obtener el ticket");
        setTicket(response.data.data);
        setEstado(response.data.data.status || "Abierto");
      } catch (err) {
        if (!axios.isCancel(err)) {
          setError((err as Error).message);
        }
      }
    };

    const fetchComentarios = async () => {
      try {
        const response = await axios.get(`http://localhost:7001/comentaries/ticket/${id}`, {
          signal: abortController.signal,
        });
        if (response.data.error) {
          throw new Error(response.data.message || "Error al obtener los comentarios");
        }
        setComentarios(response.data.data || []);
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error("Error al obtener comentarios:", err);
          setError("No se pudieron cargar los comentarios. Intenta nuevamente.");
        }
      }
    };

    fetchTicket();
    fetchComentarios();

    return () => {
      abortController.abort();
    };
  }, [id]);

  const handleNuevoComentario = async () => {
    if (!nuevoComentario.trim()) {
      setError("El comentario no puede estar vacío.");
      return;
    }

    setLoadingComentario(true);

    try {
      const idAdmin = localStorage.getItem("idAdmin");
      
      if (!idAdmin) {
        setError("No se encontró el ID del administrador en el local storage.");
        return;
      }
      console.log(nuevoComentario,idAdmin,id);
      
      const response = await axios.post("http://localhost:7001/comentaries", {
        comentario: nuevoComentario,
        idAdmin,
        idTicket: id,
      });
      console.log(response.data);
      if (response.data.error) {
        console.log(response.data);
        throw new Error(response.data.message || "Error al agregar el comentario");
      }

      setComentarios((prev) => [...prev, response.data.data]);
      setNuevoComentario("");
      setError(null);
    } catch (err) {
      console.error("Error al agregar comentario:", err);
      setError("No se pudo agregar el comentario. Intenta nuevamente.");
    } finally {
      setLoadingComentario(false);
    }
  };

  const handleEstadoChange = async () => {
    setLoading(true);

    try {
      const response = await axios.put(`http://localhost:7001/tickets/${id}`, {
        status: estado,
      });

      if (response.data.error) {
        throw new Error(response.data.message || "Error al actualizar el estado del ticket");
      }

      alert("Estado actualizado correctamente");
      setError(null);
    } catch (err) {
      console.error("Error al cambiar el estado del ticket:", err);
      setError("No se pudo cambiar el estado del ticket. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <Grid container spacing={4} justifyContent="center" className="p-6">
        {error ? (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        ) : !ticket ? (
          <Typography color="textPrimary">Cargando ticket...</Typography>
        ) : (
          <>
            <Grid item xs={12} md={6}>
              <Card elevation={3} sx={{ p: 2 }}>
                <CardContent>
                  <Typography variant="h4" fontWeight="bold">Detalles del Ticket</Typography>
                  <Typography variant="h5" color="primary" fontWeight="bold">{ticket.description}</Typography>
                  <Typography>ID: {ticket.id_ticket}</Typography>
                  <Typography>Creado: {new Date(ticket.createdAt).toLocaleString()}</Typography>
                  <Typography>Estado: {ticket.status}</Typography>
                  <Typography variant="h6" sx={{ mt: 2 }}>Cambiar Estado:</Typography>
                  <Select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value as TicketStatusType)}
                    fullWidth
                    sx={{ mt: 1 }}
                  >
                    <MenuItem value="Abierto">Abierto</MenuItem>
                    <MenuItem value="En progreso">En progreso</MenuItem>
                    <MenuItem value="Cerrado">Cerrado</MenuItem>
                  </Select>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleEstadoChange}
                    disabled={loading}
                    sx={{ mt: 2 }}
                  >
                    {loading ? <CircularProgress size={24} /> : "Actualizar Estado"}
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card elevation={3} sx={{ p: 2 }}>
                <CardContent>
                  <Typography variant="h5" fontWeight="bold" mb={2}>Comentarios</Typography>
                  <Box>
                    {comentarios.length > 0 ? (
                      comentarios.map((comentario) => (
                        <Box
                          key={comentario.id_comentario}
                          mb={2}
                          p={2}
                          border="1px solid #ccc"
                          borderRadius="8px"
                        >
                          <Typography variant="body1">{comentario.comentario}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            Por administrador {comentario.idAdmin} el {new Date(comentario.createdAt).toLocaleString()}
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" color="textSecondary">No hay comentarios aún.</Typography>
                    )}
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={nuevoComentario}
                    onChange={(e) => setNuevoComentario(e.target.value)}
                    placeholder="Escribe un comentario..."
                    sx={{ mt: 2 }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNuevoComentario}
                    disabled={loadingComentario}
                    sx={{ mt: 2 }}
                  >
                    {loadingComentario ? <CircularProgress size={24} /> : "Agregar Comentario"}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
}