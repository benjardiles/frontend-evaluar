import { useState } from "react";

type TicketStatusType = "Abierto" | "En progreso" | "Cerrado";

interface TicketFormProps {
  onSubmit: (ticket: { id: string; title: string; status: TicketStatusType; description: string; attachments: File[] }) => void;
}

export default function TicketForm({ onSubmit }: TicketFormProps) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<TicketStatusType>("Abierto");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      const newTicket = {
        id: String(Date.now()), 
        title,
        status,
        description,
        attachments,
      };

      const existingTickets = JSON.parse(localStorage.getItem("tickets") || "[]");
      existingTickets.push(newTicket);
      localStorage.setItem("tickets", JSON.stringify(existingTickets));
      onSubmit(newTicket);

      setTitle(""); 
      setStatus("Abierto"); 
      setDescription(""); 
      setAttachments([]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-black">
      <h2 className="text-2xl font-semibold text-black">Crear nuevo ticket</h2>
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-black">
          Título (máximo 40 caracteres)
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={40}
          className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
        />
        <p className="text-sm text-gray-500">{40 - title.length} caracteres restantes</p>
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-black">
          Estado
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as TicketStatusType)}
          className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
        >
          <option value="Abierto">Abierto</option>
          <option value="En progreso">En progreso</option>
          <option value="Cerrado">Cerrado</option>
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-black">
          Descripción (máximo 600 caracteres)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={600}
          className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
        />
        <p className="text-sm text-gray-500">{600 - description.length} caracteres restantes</p>
      </div>

      <div>
        <label htmlFor="attachments" className="block text-sm font-medium text-black">
          Adjuntar archivos
        </label>
        <input
          type="file"
          id="attachments"
          multiple
          onChange={handleFileChange}
          className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Crear Ticket
      </button>
    </form>
  );
}