import React, { useState } from 'react';
import { Box, TextField, IconButton, List, ListItem, ListItemText, Typography, Divider, Grid, Card, CardContent } from '@mui/material';
import { Send as SendIcon, AttachFile as AttachFileIcon, Close as CloseIcon } from '@mui/icons-material';

interface ChatMessage {
  user: string;
  message: string;
}

interface ChatProps {
  ticketId: number;
  onClose: () => void;
}

const Chat: React.FC<ChatProps> = ({ ticketId, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { user: 'Usuario', message: input }]);
      setInput('');
    }
  };

  return (
    <Grid item xs={12} md={6}>
      <Card elevation={3} sx={{ p: 2 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight="bold">
              Chat del Ticket #{ticketId}
            </Typography>
            <IconButton color="error" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ my: 2 }} />

          {/* Mensajes del Chat */}
          <Box sx={{ border: "1px solid #ddd", borderRadius: 2, p: 2, minHeight: 150, bgcolor: "#f5f5f5" }}>
            {messages.length === 0 ? (
              <Typography color="textSecondary" textAlign="center">
                No hay mensajes aún.
              </Typography>
            ) : (
              <List>
                {messages.map((msg, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={msg.user} secondary={msg.message} />
                  </ListItem>
                ))}
              </List>
            )}
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
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </Grid>
            <Grid item>
              <IconButton color="success" onClick={handleSend}>
                <SendIcon />
              </IconButton>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default Chat;