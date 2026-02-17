import api from "@/lib/api";
import { toast } from "sonner";
import { create } from "zustand";


// Accept searchParams as an argument to setToken
export const useOrgStore = create((set) => ({
    organization: null,
    loading: false,
    error: null,
    isInfoComplete: true,
    isVerified: true,

    fetchOrganization: async () => {
        set({ loading: true, error: null }); // Set loading true at start
        try {
            const res = await api.get("/organizations/admin");
            const organization = res.data.organization;

            let isInfoComplete = true;
            let isVerified = true;

            // Check if organization is verified


            // Check if steps are completed
            if (organization.verified === true) {
                isInfoComplete = true;
            }
            else if (organization.stepsCompleted) {
                const { basicDetails, addressDetails, bankDetails, documents, socialLinks, eventPreferences } = organization.stepsCompleted;
                isInfoComplete = !!(basicDetails && addressDetails && bankDetails && documents && socialLinks && eventPreferences);

                // Only check verification if all steps are completed
                if (isInfoComplete && organization.verified === false && !organization.reqForVerification) {
                    isVerified = false;
                    // toast.error("Your organization is not verified.", {
                    //     description: "Please contact support for verification or resubmit your application."
                    // });
                }
            } else {
                isInfoComplete = false;
            }

            set({
                organization,
                isInfoComplete,
                isVerified,
                loading: false, // Set loading false on success
                error: null
            });
        } catch (error) {
            console.log(error);
            const msg = error?.response?.data?.message || "Failed to fetch organization data";
            toast.error(msg);
            set({ 
                loading: false, // Set loading false on error
                error: msg 
            });
        }
    }
}));