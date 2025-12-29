// stores/eventStore.js
import { create } from "zustand";
import api from "@/lib/api";
import { GetSuccessData, prepareGroupRegistrationPayload, prepareRegistrationPayload, sortTickets, validateFormData } from "@/lib/utils/eventRegistration";
import { toast } from "sonner";

const useEventRegistrationStore = create((set, get) => ({
    registrationForm: null,
    regFormLoading: false,
    error: null,
    ticket: null,
    isSubmitting: false,
    fieldErrors: {},
    eventSlug: null,
    resData: null,
    successData: null,

    clearFieldError: (fieldName) => {
        set((state) => {
            const newErrors = { ...state.fieldErrors };
            delete newErrors[fieldName];
            return { fieldErrors: newErrors };
        });
    },

    fetchRegistrationForm: async (slug) => {
        try {
            set({ regFormLoading: true, error: null });
            const res = await api.get(`/event/${slug}/registration`);
            const sortedTickets = sortTickets(res.data.data.tickets || []);
            set({ registrationForm: { ...res.data.data, tickets: sortedTickets } });
            set({ eventSlug: slug });
            get().selectTicket();
        } catch (error) {
            set({ error: error.response?.data || "Failed to fetch registration form" });
        } finally {
            set({ regFormLoading: false });
        }
    },
    selectTicket: (id) => {
        if (!get().registrationForm) return;
        let ticket = null;
        if (id) {
            const idLower = id.toLowerCase();
            ticket = get().registrationForm?.tickets.find(t =>
                t._id?.toLowerCase() === idLower || t.type?.toLowerCase() === idLower
            ) || null;
        }
        set({ ticket });
    },
    register: async (formData) => {
        const ticketId = get().ticket?._id;
        if (!ticketId) {
            toast.error("No ticket selected");
            return { success: false, error: "No ticket selected" };
        }
        const { isValid, errors, firstErrorField } = validateFormData(
            formData,
            get().registrationForm
        );
        set({ fieldErrors: errors });
        if (!isValid) {
            return { success: false, errors, firstErrorField };
        }
        try {
            set({ isSubmitting: true, fieldErrors: {} });
            const payload = prepareRegistrationPayload(formData, ticketId, get().registrationForm);

            const response = await api.post(`/events/admin/participant/add/${get().eventSlug}`, payload);
            set({ resData: response.data.data });
            console.log(response.data);
            set({ successData: GetSuccessData(response.data) });
            return { success: response.data.code };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || " Registration failed",
            };
        } finally {
            set({ isSubmitting: false });
        }
    },
    registerGroup: async (groupData) => {
        try {
            set({ isSubmitting: true });
            if (!get().ticket?._id) {
                toast.error("No ticket selected for group registration");
                return { success: false, error: "No ticket selected" };
            }
            if (!get().ticket?.isGroupTicket) {
                toast.error("Selected ticket does not support group registration");
                return { success: false, error: "Ticket does not support group registration" };
            }
            const payload = prepareGroupRegistrationPayload(groupData, get().ticket._id, get().registrationForm);
            // console.log(payload);
            const response = await api.post(`/events/admin/participant/add/${get().eventSlug}`, payload);
            // console.log(response.data);
            set({ resData: response.data.data });
            
            // If no payment required, set success data

            set({ successData: GetSuccessData(response.data) });
            return { success: true, code: response.data.code };
        } catch (error) {
            toast.error(error.response?.data?.message || "Group registration failed", {
                description: error.response?.data?.error?.details || "",
            });
            return { success: false, error: error.response?.data?.message || "Group registration failed" };
        } finally {
            set({ isSubmitting: false });
        }
    },
    setSuccessData: (data) => {
        console.log(data);
        const dataObj = GetSuccessData(data);
        set({ successData: dataObj, resData: null });
    }
}));

export default useEventRegistrationStore;