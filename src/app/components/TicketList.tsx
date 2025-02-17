const tickets = [
  { id: 1, title: "Error en la página de inicio", status: "Abierto" },
  { id: 2, title: "Problema con el carrito de compras", status: "En progreso" },
  { id: 3, title: "Solicitud de nueva funcionalidad", status: "Cerrado" },
];

export default function TicketList({ onSelect }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Lista de Tickets</h2>
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Título</th>
            <th className="border p-2">Estado</th>
            <th className="border p-2">Acción</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id} className="border">
              <td className="border p-2">{ticket.id}</td>
              <td className="border p-2">{ticket.title}</td>
              <td className="border p-2">{ticket.status}</td>
              <td className="border p-2">
                <button
                  className="bg-blue-600 text-white px-4 py-1 rounded"
                  onClick={() => onSelect(ticket)}
                >
                  Ver detalles
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}