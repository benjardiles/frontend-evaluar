import Link from "next/link";
import { useState } from "react";
import { CircularProgress, Button } from "@mui/material";

type TicketStatusType = "Abierto" | "En progreso" | "Cerrado";

interface Ticket {
  id_ticket: string;
  description: string;
  status: TicketStatusType;
}

interface TicketListProps {
  tickets: Ticket[];
}

export default function TicketList({ tickets }: TicketListProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleClick = async (id: string) => {
    setLoading(id);
    setTimeout(() => setLoading(null), 1500); // Mantener el spinner por 1.5 segundos
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-black">Lista de Tickets</h2>
      <table className="w-full border-collapse border border-gray-300 text-black">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2 text-left">ID</th>
            <th className="border p-2 text-left">Título</th>
            <th className="border p-2 text-left">Estado</th>
            <th className="border p-2 text-left">Acción</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id_ticket} className="border hover:bg-gray-100">
              <td className="border p-2">{ticket.id_ticket}</td>
              <td className="border p-2">{ticket.description}</td>
              <td className="border p-2">{ticket.status}</td>
              <td className="border p-2">
                <Link href={`/ticket/${ticket.id_ticket}`} passHref>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleClick(ticket.id_ticket)}
                    disabled={loading === ticket.id_ticket}
                    style={{ minWidth: "120px" }}
                  >
                    {loading === ticket.id_ticket ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Ver detalles"
                    )}
                  </Button>
                </Link>
              </td> 
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
