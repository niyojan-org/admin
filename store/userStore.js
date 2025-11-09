import api, { setAccessToken } from "@/lib/api";
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

  setToken: async () => {
    try {


      // // Check if user data already exists
      // const currentState = useUserStore.getState();
      // if (currentState.user && currentState.organization) {
      //   set({ token, isAuthenticated: true });
      //   return true;
      // }

      // Fetch user data only if not present
      const resUser = await api.get("/user/me");
      const user = resUser.data.data.user;
      setAccessToken({ isAuthenticated: true });
      let organization = null;
      try {
        // Fetch organization separately
        const resOrg = await api.get("/org/me");
        organization = resOrg.data.org;
        useOrgStore.getState().setOrganization(organization);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Session expired or organization not found. Please login again.");
      }
      // Store in org store too

      set({ user, organization, isAuthenticated: true, error: null });
      // toast.success("Welcome to your back..!!");

      return true;
    } catch (error) {
      set({ isAuthenticated: false, user: null, token: null, organization: null });
      // toast.error(error?.response?.data?.message || "Session expired or organization not found. Please login again.");
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
      const res = await api.post("/auth/login", { email, password });

      const { token } = res.data.data;
      setAccessToken(token);

      // use token to fetch user + organization
      const ok = await useUserStore.getState().setToken({ token });
      if (ok) {
        toast.success("Login successful..!!");
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

  logout: async () => {
    set({ user: null, token: null, organization: null, isAuthenticated: false, error: null });
    try {
      const response = await api.post("/auth/logout");
      toast.success(response.data.message || "Logged out successfully");
      // redirect("/auth");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  },

}));
