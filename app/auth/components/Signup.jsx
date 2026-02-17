"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff } from "lucide-react";
import FloatingInput from "@/components/ui/FloatingInput";
import { useUserStore } from "@/store/userStore";
import { useRef } from "react";
// import { useLoaderStore } from "@/store/loaderStore";
import Link from "next/link";
import GoogleAuthButton from "./GoogleAuthButton";
import { IconLoader2 } from "@tabler/icons-react";

export default function Signup({ onViewChange }) {
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const { register, loading } = useUserStore();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email address is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const isFormValid =
    formData.name &&
    formData.email &&
    formData.password &&
    /\S+@\S+\.\S+/.test(formData.email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const success = await register(formData);
    if (success) {
      setFormData({
        name: "",
        email: "",
        password: "",
      });
      onViewChange("login");
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      autoComplete="off"
      className="flex flex-col flex-1 justify-between font-inter w-full "
    >
      {errors.general && (
        <p className="text-destructive text-sm text-center">{errors.general}</p>
      )}

      <div className="space-y-4">
        <FloatingInput
          label="Full name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          autoComplete="name"
          className="w-full"
        />
        {errors.name && (
          <p className="text-destructive text-sm">{errors.name}</p>
        )}

        <FloatingInput
          label="Email address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          autoComplete="email"
          className="w-full"
        />
        {errors.email && (
          <p className="text-destructive text-sm">{errors.email}</p>
        )}

        <div className="relative">
          <FloatingInput
            label="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            autoComplete="new-password"
            className=""
          />
          <Button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            variant={"icon"}
            className="absolute right-2 top-3/6 -translate-y-1/6 "
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </Button>
        </div>
        {errors.password && (
          <p className="text-destructive text-sm">{errors.password}</p>
        )}

        <Button
          type="submit"
          disabled={loading || !isFormValid}
          className="w-full py-3 mt-2 rounded-full font-inter font-medium transition-all duration-200 cursor-pointer"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <IconLoader2 size={20} className="text-primary animate-spin" />
              Signing up...
            </span>
          ) : (
            "Submit"
          )}
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between items-center text-xs text-muted-foreground pb-6 mt-7 gap-y-3 font-medium">
        <Link
          href="/terms-and-conditions"
          className="hover:underline whitespace-nowrap hover:text-foreground transition-colors"
        >
          Terms & Conditions
        </Link>
        <p className="whitespace-nowrap flex">
          Already have an account?{" "}
          <span
            type="button"
            onClick={() => onViewChange("login")}
            className="text-primary hover:underline cursor-pointer underline-offset-2 pl-2"
          >
            Log In
          </span>
        </p>
      </div>
    </form>
  );
}
