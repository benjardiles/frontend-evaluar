import Link from "next/link";

type TicketStatusType = "Abierto" | "En progreso" | "Cerrado"; 

interface Ticket {
  id: string;
  title: string;
  status: TicketStatusType;
}

interface TicketListProps {
  tickets: Ticket[];
}

export default function TicketList({ tickets }: TicketListProps) {
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
            <tr key={ticket.id} className="border hover:bg-gray-100">
              <td className="border p-2">{ticket.id}</td>
              <td className="border p-2">{ticket.title}</td>
              <td className="border p-2">{ticket.status}</td>
              <td className="border p-2">
                {/* Usamos el componente Link para la navegación */}
                <Link href={`/ticket/${ticket.id}`}>
                  <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
                    Ver detalles
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}