import React from "react";

interface NotificationProps {
    message: string;
    isError: boolean;
}

const Notification: React.FC<NotificationProps> = ({ message, isError }) => {
    return (
        <div className={`notification ${isError ? "error" : "success"}`}>
            {message}
            <style jsx>{`
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    color: white;
                    padding: 10px 15px;
                    border-radius: 5px;
                    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                    animation: fadeInOut 3s ease-in-out;
                }

                .success {
                    background: #0070f3; /* Azul */
                }

                .error {
                    background: #ff4d4f; /* Rojo */
                }

                @keyframes fadeInOut {
                    0% {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    10% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                    90% {
                        opacity: 1;
                    }
                    100% {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                }
            `}</style>
        </div>
    );
};

export default Notification;