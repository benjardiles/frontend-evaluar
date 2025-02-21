import React, { createContext, useContext, useState } from "react";
import Notification from "../components/Notification";

interface ShowNotificationType{
    msg: string;
    duration?: number;
    isError?: boolean;
    
}
interface ModalContextType {
    showNotification: (settings:ShowNotificationType) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [message, setMessage] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isError, setIsError] = useState(false);

    const showNotification = (settings:ShowNotificationType) => {
        const { msg, duration = 3000, isError=false } = settings;
        setMessage(msg);
        setIsOpen(true);
        setIsError(isError);

        // Cierra la notificación después del tiempo especificado
        setTimeout(() => {
            setIsOpen(false);
        }, duration);
    };

    return (
        <ModalContext.Provider value={{ showNotification }}>
            {children}
            {isOpen && <Notification message={message} isError={isError} />}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("useModal debe usarse dentro de un ModalProvider");
    }
    return context;
};