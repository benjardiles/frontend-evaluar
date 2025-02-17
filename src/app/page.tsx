import { useState } from "react";
import Navbar from "./components/Navbar";
import TicketList from "./components/TicketList";
import TicketDetails from "./components/TicketDetails";

export default function Home() {
  const [selectedTicket, setSelectedTicket] = useState(null);

  return (
    <>
      <Navbar />
      <main className="flex flex-col lg:flex-row gap-4 p-4">
        {/* Lista de Tickets /}
        <div className="w-full lg:w-1/2">
          <TicketList onSelect={setSelectedTicket} />
        </div>

        {/ Detalles del Ticket */}
        <div className="w-full lg:w-1/2">
          {selectedTicket ? (
            <TicketDetails ticket={selectedTicket} />
          ) : (
            <p className="text-gray-500">Selecciona un ticket para ver detalles</p>
          )}
        </div>
      </main>
    </>
  );
}