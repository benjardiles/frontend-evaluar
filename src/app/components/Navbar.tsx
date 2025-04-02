import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Navbar: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Limpiar todo el localStorage
    localStorage.clear();

    // Redirigir al usuario a la página de inicio de sesión
    router.push("/login");
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: 'linear-gradient(90deg, #4CAF50 0%, #008080 50%, #4682B4 100%)', // Degradado más suave
      }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Link href="/" passHref>
            <Image
              src="/Logo_Evaluar.cl_con_lema-removebg-preview.png"
              alt="Descripción"
              width={150}
              height={90}
              priority
              style={{ cursor: 'pointer' }}
            />
          </Link>
        </Box>
        <Box sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center', mr: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '1rem', mb: 1 }}>
            Contáctanos: <a href="mailto:info@evaluar.cl" style={{ color: '#FFD700', textDecoration: 'none' }}>info@evaluar.cl</a>
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '1rem', mb: 1 }}>
            WhatsApp: <a href="https://wa.me/56989323735" target="_blank" rel="noopener noreferrer" style={{ color: '#FFD700', textDecoration: 'none' }}>+56 9 8932 3735</a>
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '1rem' }}>
            Síguenos en: <a href="https://twitter.com/eval_docentes" target="_blank" rel="noopener noreferrer" style={{ color: '#FFD700', textDecoration: 'none' }}>@eval_docentes</a>
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={handleLogout}
          sx={{
            backgroundColor: '#FF8C00', // Naranja oscuro
            color: '#FFFFFF',
            fontWeight: 'bold',
            ml: 2,
            '&:hover': {
              backgroundColor: '#FF7F00', // Naranja más claro al pasar el mouse
            },
          }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;