import api from "@/lib/api";
import { toast } from "sonner";
import { create } from "zustand";
import { useOrgStore } from "./orgStore";
import { redirect } from "next/navigation";

export const useUserStore = create((set) => ({
  user: null,
  organization: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: null,

  setOrganization: (organization) => {
    set({ organization });
  },

  setToken: async ({ token }) => {
    try {
      if (!token) {
        toast.error("Token is required");
        return false;
      }

      // Save token to sessionStorage  console.log(eventData);
      sessionStorage.setItem("token", token);

      // Fetch user data
      const currentState = useUserStore.getState();
      if (currentState.user) {
        return true; // User already set, no need to fetch again
      }
      const resUser = await api.get("/user/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const user = resUser.data.data.user;

      // Fetch organization separately
      const resOrg = await api.get("/org/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const organization = resOrg.data.org;

      // Store in org store too
      useOrgStore.getState().setOrganization(organization);

      set({ token, user, organization, isAuthenticated: true, error: null });
      toast.success("Welcome to your dashboard!", {
        description: `You can now access ${organization.name}`,
      });

      return true;
    } catch (error) {
      console.error("Error setting token:", error);
      toast.error("Session expired or organization not found. Please login again.");
      sessionStorage.clear();
      return false;
    } finally {
      set({ loading: false });
    }
  },

  login: async ({ email, password }) => {
    if (!email || !password) {
      toast.error("Email and password are required");
      return false;
    }
    try {
      set({ loading: true, error: null });
      const res = await api.post("/api/auth/login", { email, password });

      const { token } = res.data.data;

      // use token to fetch user + organization
      const ok = await useUserStore.getState().setToken({ token });
      if (ok) {
        setTimeout(() => redirect("/dashboard"), 500);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      const msg = error?.response?.data?.message || "Login failed";
      set({ error: msg });
      toast.error(msg);
      return false;
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    sessionStorage.clear();
    set({ user: null, token: null, organization: null, isAuthenticated: false, error: null });
    toast.success("Logged out successfully");
    redirect("/auth");
  },
}));
