import api from "@/lib/api";

export async function fetchEvent(eventId) {
  const { data } = await api.get(`/event/admin/${eventId}`);
  return data?.data?.event || null;
}

