"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button, Typography, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async () => {
        const data = await fetchLogin({ email, password });
        if (data) {
            // Guardar el ID del usuario en el local storage
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("isAuthenticated", "true");
            router.push("/ticket");
        } else {
            setErrorMessage("Correo electrónico o contraseña incorrectos");
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const fetchLogin = async ({ email, password }: { email: string, password: string }) => {
        const credentials = btoa(`${email}:${password}`); // Codifica en Base64

        try {
            const response = await fetch("http://localhost:7001/auth/login/admin", {
                method: "POST",
                headers: {
                    "Authorization": `Basic ${credentials}`, // Envío de credenciales
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error("Error en la autenticación");
            }

            const data = await response.json();
            console.log("✅ Autenticación exitosa:", data);
            return data;
        } catch (error) {
            console.error("❌ Error al autenticar:", error);
            return null;
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-[#0B132B]">
            <div className="flex w-[800px] h-[500px] bg-white shadow-2xl rounded-2xl overflow-hidden">
                {/* Left Section */}
                <div className="w-1/2 bg-[#57B6F7] flex flex-col justify-center items-center text-white p-6">
                    <Typography variant="h5" className="text-center font-semibold">
                        Sistema de solicitudes de tickets.
                    </Typography>
                    <div className="mt-6 flex justify-center">
                        <img src="/Logo_Evaluar.cl_con_lema-removebg-preview.png" alt="Logo" className="w-96 h-auto" />
                    </div>
                </div>

                {/* Right Section */}
                <div className="w-1/2 p-8 bg-[#1E2A47] text-white flex flex-col justify-center">
                    <Typography variant="h5" className="text-center font-semibold mb-4">
                        Iniciar Sesión
                    </Typography>
                    <TextField
                        label="Correo Electrónico"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setErrorMessage(null); // Limpiar el mensaje de error al escribir
                        }}
                        className="bg-white rounded-lg"
                        error={!!errorMessage}
                        helperText={errorMessage}
                    />
                    <TextField
                        label="Contraseña"
                        type={showPassword ? "text" : "password"}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setErrorMessage(null); // Limpiar el mensaje de error al escribir
                        }}
                        className="bg-white rounded-lg mb-4"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        error={!!errorMessage}
                        helperText={errorMessage}
                    />
                    <div className="flex items-center mt-4">
                        <Button
                            variant="contained"
                            fullWidth
                            className="mt-4 bg-[#57B6F7] hover:bg-[#1BB070] text-white py-2 rounded-lg shadow-md transition duration-300"
                            onClick={handleLogin}
                        >
                            Ingresar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}