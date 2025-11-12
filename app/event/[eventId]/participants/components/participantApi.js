import api from "@/lib/api";
import { toast } from "sonner";

export async function fetchParticipants({ eventId, page = 1, limit = 10, search = "", status = "", ticketType = "", paymentStatus = "", sortField = "createdAt", sortOrder = "desc", isGroupRegisteration = undefined, groupId = undefined, isGroupLeader = undefined }) {
  const params = { page, limit, search, status, ticketType, paymentStatus, sortField, sortOrder }
  const { data } = await api.get(`/event/admin/participant/${eventId}`, { params });
  return data;
};

export async function confirmParticipantData(eventId, participantId) {

  try {
    const { data } = await api.post(`/event/admin/${eventId}/confirm-participant/${participantId}`);
    toast.success(data.message || "Participant confirmed successfully!");
    return data?.data || null;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to confirm participant.");
    console.error("Error confirming participant:", error);
    throw error;
  }
}