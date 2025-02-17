"use client"

import { useState } from "react"
import {
  Button,
  TextField,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material"
import { CloudUpload, Close } from "@mui/icons-material"

export default function TicketForm({ onSubmit }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [files, setFiles] = useState([])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ title, description, files })
    setTitle("")
    setDescription("")
    setFiles([])
  }

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
      }))
      setFiles([...files, ...newFiles])
    }
  }

  const removeFile = (indexToRemove) => {
    setFiles(files.filter((_, index) => index !== indexToRemove))
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        fullWidth
        label="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value.slice(0, 40))}
        required
        margin="normal"
        helperText={`${title.length}/40 caracteres`}
      />
      <TextField
        fullWidth
        label="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value.slice(0, 600))}
        required
        multiline
        rows={4}
        margin="normal"
        helperText={`${description.length}/600 caracteres`}
      />
      <Box sx={{ mt: 2, mb: 2 }}>
        <input
          accept="image/*,application/pdf"
          style={{ display: "none" }}
          id="raised-button-file"
          multiple
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="raised-button-file">
          <Button variant="contained" component="span" startIcon={<CloudUpload />}>
            Subir archivos
          </Button>
        </label>
      </Box>
      {files.length > 0 && (
        <List>
          {files.map((file, index) => (
            <ListItem key={index}>
              <ListItemText primary={file.name} secondary={`${Math.round(file.size / 1024)} KB`} />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete" onClick={() => removeFile(index)}>
                  <Close />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
        Crear Ticket
      </Button>
    </form>
  )
}

