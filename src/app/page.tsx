"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import TicketForm from "./components/TicketForm";
import TicketList from "./components/TicketList";

type TicketStatusType = "Abierto" | "En progreso" | "Cerrado"; 

interface Ticket {
  id: string;
  title: string;
  status: TicketStatusType;
}

export default function Home() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const handleAddTicket = (ticket: Ticket) => {
    setTickets([...tickets, ticket]);
  };

  return (
    <>
      <Navbar />
      <main className="flex flex-col lg:flex-row gap-4 p-4 bg-white min-h-screen">
        {/* Lista de Tickets */}
        <div className="w-full lg:w-1/3 border p-4 rounded shadow flex-grow">
          <TicketList tickets={tickets} />
        </div>

        {/* Formulario de creación de Tickets */}
        <div className="w-full lg:w-1/3 border p-4 rounded shadow flex-grow mt-4 lg:mt-0">
          <TicketForm onSubmit={handleAddTicket} />
        </div>
      </main>
    </>
  );
}