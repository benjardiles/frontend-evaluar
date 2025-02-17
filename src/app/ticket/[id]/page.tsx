
"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import TicketStatus from "../../components/TicketStatus";
import Navbar from "@/app/components/Navbar";

type TicketStatusType = "Abierto" | "En progreso" | "Cerrado";

interface Ticket {
  id: string;
  title: string;
  status: TicketStatusType;
  description: string;
}

export default function TicketDetails() {
  const pathname = usePathname();
  const id = pathname?.split("/").pop();
  const [ticket, setTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    // Recuperar los tickets desde localStorage
    const ticketsData: Ticket[] = JSON.parse(localStorage.getItem("tickets") || "[]");

    // Buscar el ticket con el id correspondiente
    const foundTicket = ticketsData.find((ticket) => ticket.id === id);
    setTicket(foundTicket || null);
  }, [id]);

  if (!ticket) {
    return <p>Ticket no encontrado.</p>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full h-full max-w-4xl">
          <h1 className="text-3xl font-bold text-black mb-4">Detalle de Ticket</h1>
          <h2 className="text-2xl font-semibold text-black">{ticket.title}</h2>
          <p className="text-black">ID: {ticket.id}</p>

          <div className="mt-4">
            <h3 className="text-lg font-medium text-black">Estado del Ticket:</h3>
            <TicketStatus status={ticket.status} />
          </div>

          <p className="mt-4 text-black">
            Descripción: {ticket.description}
          </p>

          <button className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300">
            Abrir Chat
          </button>
        </div>
      </div>
    </div>
  );
}