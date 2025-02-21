type TicketStatusType = "Abierto" | "En progreso" | "Cerrado"; 

interface Ticket {
  id_ticket: string;
  description: string;
  status: TicketStatusType;
}
