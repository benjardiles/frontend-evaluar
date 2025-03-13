import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Navbar: React.FC = () => {
  const router = useRouter();

  const handleHomeClick = () => {
    const userRole = localStorage.getItem("userRole");
    if (userRole === "admin") {
      router.push("/"); // Ruta para el administrador
    } else {
      router.push("/user"); // Ruta para el usuario
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#56A632' }}>
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
        <Box sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '1rem', mb: 1 }}>
            Contáctanos: <a href="mailto:info@evaluar.cl" style={{ color: '#FFD700', textDecoration: 'none' }}>info@evaluar.cl</a>
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '1rem' }}>
            Síguenos en: <a href="https://twitter.com/eval_docentes" target="_blank" rel="noopener noreferrer" style={{ color: '#FFD700', textDecoration: 'none' }}>@eval_docentes</a>
          </Typography>
        </Box>
        
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;