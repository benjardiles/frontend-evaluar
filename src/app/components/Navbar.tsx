import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const Navbar: React.FC = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#56A632' }}>
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          <img src="Logo_Evaluar.cl_con_lema-removebg-preview.png" alt="Logo" style={{ height: '150px' }} />
        </Typography>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '1.2rem' }}>
            Contáctanos: <a href="mailto:info@evaluar.cl" style={{ color: '#FFD700', textDecoration: 'none' }}>info@evaluar.cl</a>
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '1.2rem' }}>
            Síguenos en: <a href="https://twitter.com/eval_docentes" target="_blank" rel="noopener noreferrer" style={{ color: '#FFD700', textDecoration: 'none' }}>@eval_docentes</a>
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;