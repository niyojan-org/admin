import api, { setAccessToken, clearAccessToken } from "@/lib/api";
import { toast } from "sonner";
import { create } from "zustand";
import { loginWithPasskey as passkeyLogin } from "@/lib/passkey";

export const useUserStore = create((set, get) => ({
  user: null,
  organization: null,
  loading: false,
  error: null,
  message: null,
  isAuthenticated: false,

  // --- LOGIN ---
  login: async (credentials) => {
    const { email, password } = credentials;
    if (!email || !password) {
      toast.error("Email and password are required");
      return false;
    }

    try {
      set({ loading: true, error: null });
      const response = await api.post("/auth/login", credentials);

      // Check if 2FA is required
      if (response.data.requiresTOTP || response.data.requiresPasskey) {
        set({ loading: false });
        return {
          requires2FA: true,
          requiresTOTP: response.data.requiresTOTP,
          requiresPasskey: response.data.requiresPasskey,
          userId: response.data.userId,
          message: response.data.message,
        };
      }

      const { userId, name, email: userEmail, avatar, token, organizationId } =
        response.data.data;

      // Store access token in memory
      setAccessToken(token);

      set({
        user: { userId, name, email: userEmail, avatar, organizationId },
        isAuthenticated: true,
        message: response.data.message,
      });

      toast.success(response.data.message || "Login successful!");
      return { success: true };
    } catch (error) {
      const msg = error?.response?.data?.message || "Login failed";
      set({ error: msg, isAuthenticated: false });
      toast.error(msg, {
        description: error?.response?.data?.error?.details,
      });
      return { success: false, error: msg };
    } finally {
      set({ loading: false });
    }
  },

  // --- PASSKEY LOGIN ---
  loginWithPasskey: async (useConditionalUI = false, abortController = null) => {
    try {
      // For conditional UI, don't show loading state
      // This allows the form to remain interactive while waiting for passkey selection
      if (!useConditionalUI) {
        set({ loading: true, error: null });
      }

      // Call the passkey login utility with optional AbortController
      const result = await passkeyLogin(useConditionalUI, abortController);

      // If user cancelled (didn't select a passkey), don't show error
      if (result.cancelled) {
        return false;
      }

      if (!result.success) {
        throw new Error(result.message || "Passkey login failed");
      }
      const { name, email, avatar, token } = result.data;

      // Store access token in memory
      setAccessToken(token);

      // Extract userId and organizationId from the returned data if available
      const userId = result.data.userId || result.data.id;
      const organizationId = result.data.organizationId;

      set({
        user: { userId, name, email, avatar, organizationId },
        isAuthenticated: true,
        message: result.message || "Passkey login successful!",
      });

      toast.success(result.message || "Passkey login successful!");
      return true;
    } catch (error) {
      const msg = error?.message || "Passkey login failed";
      set({ error: msg, isAuthenticated: false });

      // Only show error toast for non-conditional UI attempts
      if (!useConditionalUI) {
        toast.error(msg);
      }
      return false;
    } finally {
      if (!useConditionalUI) {
        set({ loading: false });
      }
    }
  },

  // --- REGISTER ---
  register: async (userData) => {
    const { name, email, password } = userData;
    if (!name || !email || !password) {
      toast.error("All fields are required");
      return false;
    }

    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,32}$/;
    if (!strongPassword.test(password)) {
      toast.error(
        "Weak password: must include 1 uppercase, 1 lowercase, 1 number, 1 special character, min 8 chars"
      );
      return false;
    }

    try {
      set({ loading: true, error: null });
      const response = await api.post("/auth/register", userData);
      toast.success(response.data.message || "Registration successful!");
      return true;
    } catch (error) {
      const msg = error?.response?.data?.message || "Registration failed";
      set({ error: msg });
      toast.error(msg);
      return false;
    } finally {
      set({ loading: false });
    }
  },

  // --- LOGOUT ---
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {
      // ignore network errors
    } finally {
      clearAccessToken();
      set({
        user: null,
        organization: null,
        isAuthenticated: false,
        error: null,
        message: null,
      });
      toast.success("Logout successful!");
    }
  },

  // --- FETCH USER ---
  fetchUser: async () => {
    try {
      set({ loading: true, error: null });
      const response = await api.get("/users/me");
      const user = response.data.data;
      set({
        user,
        isAuthenticated: true,
      });
      try {

      } catch {

      }
      return true;
    } catch (error) {
      clearAccessToken();
      set({
        user: null,
        organization: null,
        isAuthenticated: false,
      });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  // --- UPDATE USER ---
  updateUser: async (updatedData) => {
    try {
      set({ loading: true, error: null });
      const response = await api.patch("/user/me", updatedData);

      const updatedUser = response.data.data;
      set((state) => ({
        user: { ...state.user, ...updatedUser },
        message: "Profile updated successfully",
      }));
      toast.success(response.data.message || "Profile updated successfully");
      return true;
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to update profile";
      toast.error(msg, {
        description: error?.response?.data?.error?.details,
      });
      set({ error: msg });
      toast.error(msg);

      if (error.response?.status === 401) {
        clearAccessToken();
        set({ user: null, isAuthenticated: false });
      }
      return false;
    } finally {
      set({ loading: false });
    }
  },

  // --- RESEND VERIFICATION EMAIL ---
  resendVerificationEmail: async (email) => {
    try {
      set({ loading: true, error: null });
      const response = await api.post("/auth/resend-verification", { email });
      toast.success(response.data.message || "Verification email sent!");
      set({ message: response.data.message });
      return true;
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        "Failed to resend verification email.";
      set({ error: msg });
      toast.error(msg);
      return false;
    } finally {
      set({ loading: false });
    }
  },

  // --- VERIFY TOTP ---
  verifyTOTP: async (userId, totpCode) => {
    try {
      set({ loading: true, error: null });
      const response = await api.post("/auth/totp/verify-login", { userId, token: totpCode });

      const { name, email, avatar, token, organizationId } = response.data.data;

      // Store access token in memory
      setAccessToken(token);

      set({
        user: { userId, name, email, avatar, organizationId },
        isAuthenticated: true,
        message: response.data.message,
      });

      toast.success(response.data.message || "TOTP verification successful!");
      return { success: true };
    } catch (error) {
      const msg = error?.response?.data?.message || "TOTP verification failed";
      set({ error: msg });
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      set({ loading: false });
    }
  },

  // --- VERIFY BACKUP CODE ---
  verifyBackupCode: async (userId, backupCode) => {
    try {
      set({ loading: true, error: null });
      const response = await api.post("/auth/verify-backup-code", { userId, backupCode });

      const { name, email, avatar, token, organizationId } = response.data.data;

      // Store access token in memory
      setAccessToken(token);

      set({
        user: { userId, name, email, avatar, organizationId },
        isAuthenticated: true,
        message: response.data.message,
      });

      toast.success(response.data.message || "Account recovered successfully!");
      return { success: true };
    } catch (error) {
      const msg = error?.response?.data?.message || "Backup code verification failed";
      set({ error: msg });
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      set({ loading: false });
    }
  },
}));
