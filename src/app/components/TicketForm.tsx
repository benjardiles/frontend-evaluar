import { useState } from "react";
import axios from "axios";
import { useModal } from "../context/ModalContext";

type TicketStatusType = "Abierto" | "En progreso" | "Cerrado";

interface TicketFormProps {
  onSubmit: (ticket: { id_ticket: string; title: string; status: TicketStatusType; description: string; attachments: File[] }) => void;
}

export default function TicketForm({ onSubmit }: TicketFormProps) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<TicketStatusType>("Abierto");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const { showNotification } = useModal();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      const newTicket = {
        id_ticket: String(Date.now()), 
        title,
        status,
        description,
        attachments,
      };

      try {
        // Llamada a la API para enviar el ticket al backend
        const response = await axios.post("http://localhost:7001/tickets", {
          description: newTicket.description,
          id_user: newTicket.id_ticket,
        });
        
        console.log("Ticket creado:", response.data);

        // Guardar el ticket en localStorage
        const existingTickets = JSON.parse(localStorage.getItem("tickets") || "[]");
        existingTickets.push(newTicket);
        localStorage.setItem("tickets", JSON.stringify(existingTickets));
        onSubmit(newTicket);
        
        // Mostrar notificación
        showNotification({
          isError: response.data?.error,
          msg: response.data?.message,
        });
        
        // Resetear el formulario
        setTitle(""); 
        setStatus("Abierto"); 
        setDescription(""); 
        setAttachments([]);
      } catch (error) {
        console.error("Error al crear el ticket:", error);
      }
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
          required
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
          <option value="OPEN">Abierto</option>
          <option value="IN_PROGRESS">En progreso</option>
          <option value="CLOSED">Cerrado</option>
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
          required
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
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        disabled={!title.trim() || !description.trim()}
      >
        Crear Ticket
      </button>
    </form>
  );
}