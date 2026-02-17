"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import FloatingInput from "@/components/ui/FloatingInput";
import { toast } from "sonner";
import api from "@/lib/api";
// import { useLoader } from "@/components/LoaderContext";
// import { useLoaderStore } from "@/store/loaderStore";
import Link from "next/link";

export default function ForgotPassword({ onViewChange, userEmail, setUserEmail }) {
  const [formData, setFormData] = useState({ email: userEmail || "" });
  const [errors, setErrors] = useState({});
  const { showLoader, hideLoader } = useLoaderStore();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", general: "" }));

    if (name == 'email') {
      setUserEmail(value);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email address is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("email format wrong..!");
      return;
    }

    showLoader(); // Show loader when API call starts
    try {
      const res = await api.post("/api/auth/forgot-password", {
        email: formData.email,
      });
      toast.success(res.data.message);
      setFormData({ email: "" });
      onViewChange("login");
    } catch (error) {
      console.error("Fetch user error:", error);
      toast.error(
        error.response?.data?.message ||
        "Failed to fetch user. Please try again."
      );
    } finally {
      hideLoader(); // Hide loader when API call completes (success or error)
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col flex-1 justify-between font-poppins w-full "
    >
      {errors.general && (
        <p className="text-destructive text-sm text-center">{errors.general}</p>
      )}
      <FloatingInput
        label="Email address"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        className="border-border w-full p-2 rounded-full border pl-4 focus:border-ring focus:ring-1 focus:ring-ring"
      />
      {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}

      <Button
        type="submit"
        disabled={!formData.email}
        className="w-full mt-5 p-5 rounded-full font-poppins font-medium transition-all duration-200 hover:cursor-pointer"
      >
        Submit
      </Button>

      <div className="mt-auto  flex flex-col sm:flex-row sm:justify-between items-center text-xs text-muted-foreground gap-y-4">
        <Link href="/terms-and-conditions" className="hover:underline whitespace-nowrap font-medium hover:text-foreground transition-colors">
          Terms & Conditions
        </Link>
        <p className="whitespace-nowrap font-medium">
          Back to{" "}
          <Button
            type="button"
            onClick={() => onViewChange("login")}
            className="text-primary hover:underline bg-transparent hover:bg-transparent transition-colors"
          >
            Login
          </Button>
        </p>
      </div>
    </form>
  );
}