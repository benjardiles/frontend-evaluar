export default function TicketStatus({ status }) {
    const statusMap = {
      Abierto: { color: "text-green-600", icon: "✔" },
      "En progreso": { color: "text-blue-600", icon: "⏳" },
      Cerrado: { color: "text-gray-400", icon: "⚪" },
    };
  
    return (
      <div className={flex items-center space-x-2 ${statusMap[status]?.color}}>
        <span className="text-lg">{statusMap[status]?.icon}</span>
        <span>{status}</span>
      </div>
    );
  }