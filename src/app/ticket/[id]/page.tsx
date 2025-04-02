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
    let tempComentario: Comentario;

    try {
      const idAdmin = localStorage.getItem("idAdmin");
      if (!idAdmin) {
        setError("No se encontró el ID del administrador en el local storage.");
        return;
      }
      tempComentario = {
        id_comentario: Math.floor(Math.random() * 1000000), // Generar un ID temporal
        comentario: nuevoComentario,
        idAdmin,
        id_ticket: Number(id),
        createdAt: new Date().toISOString(),
      };

      setComentarios((prev) => [...prev, tempComentario]); // Agregar el nuevo comentario temporalmente
      setNuevoComentario(""); // Limpiar el campo de texto
      setError(null); // Limpiar errores previos
      const response = await axios.post("http://localhost:7001/comentaries", {
        comentario: nuevoComentario,
        idAdmin,
        idTicket: id,
        
      });
      const response2 = await axios.get(`http://localhost:7001/comentaries/ticket/${id}`);
      if (response2.data.error) {
        throw new Error(response2.data.message || "Error al obtener comentarios actualizados");
      }
      
      // 5. Actualizar lista de comentarios con datos frescos del backend
      setComentarios(response2.data.data || []);
      
    } catch (err) {
      console.error("Error al agregar comentario:", err);
      setError("No se pudo agregar el comentario. Intenta nuevamente.");
      
      // Revertir optimistic update en caso de error
      setComentarios(prev => prev.filter(c => c.id_comentario !== tempComentario.id_comentario));
    } finally {
      setLoadingComentario(false);
    }
  };
      

     

      // Transformar la fecha del nuevo comentario para evitar "Invalid Date"
     

      // Actualizar el estado de los comentarios con el nuevo comentario


    const handleEstadoChange = async () => {
    setLoading(true); // Mostrar indicador de carga
  
    try {
      // Realizar la solicitud PUT al backend
      const response = await axios.put(`http://localhost:7001/tickets/${id}`, {
        status: estado, // Enviar el nuevo estado
      });
  
      if (response.data.error) {
        throw new Error(response.data.message || "Error al actualizar el estado del ticket");
      }
  
      // Actualizar el estado del ticket en el frontend
      setTicket((prevTicket) => prevTicket ? { ...prevTicket, status: estado } : null);
  
      alert("Estado actualizado correctamente");
      setError(null); // Limpiar errores previos
    } catch (err) {
      console.error("Error al cambiar el estado del ticket:", err);
      setError("No se pudo cambiar el estado del ticket. Intenta nuevamente.");
    } finally {
      setLoading(false); // Ocultar indicador de carga
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
                          key={comentario.id_comentario} // Clave única para cada comentario
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