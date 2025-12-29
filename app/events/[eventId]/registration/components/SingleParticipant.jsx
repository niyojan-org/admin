"use client";
import { Button } from "@/components/ui/button";
import useEventRegistrationStore from "@/store/eventRegistration";
import Link from "next/link";
import { useState, useRef } from "react";
import { toast } from "sonner";
import DynamicField from "./DynamicField";

function SingleParticipant({ allFields }) {
  const [data, setData] = useState({});
  const { register, ticket, isSubmitting, fieldErrors, clearFieldError, registrationForm } =
    useEventRegistrationStore();
  const fieldRefs = useRef({});

  const handleFieldChange = (name, val) => {
    setData((prev) => ({ ...prev, [name]: val }));
    if (fieldErrors[name]) {
      clearFieldError(name);
    }
  };

  const handleFieldFocus = (name) => {
    // Scroll the field into view when focused (helps with mobile keyboard)
    if (fieldRefs.current[name]) {
      setTimeout(() => {
        fieldRefs.current[name].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 300); // Delay to allow keyboard animation
    }
  };

  const handleSubmit = async () => {
    const result = await register(data);

    if (!result.success) {
      toast.error(result.error || "Please fill all required fields correctly.");
      if (result.firstErrorField && fieldRefs.current[result.firstErrorField]) {
        fieldRefs.current[result.firstErrorField].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    } else {
      // toast.success("Registration successful!");
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {allFields.map((f) => (
          <div key={f.name} ref={(el) => (fieldRefs.current[f.name] = el)}>
            <DynamicField
              field={f}
              value={data[f.name] || ""}
              onChange={handleFieldChange}
              onFocus={handleFieldFocus}
              error={fieldErrors[f.name]}
            />
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-500 my-2">
        By proceeding, you agree to our{" "}
        <Link href="/terms-and-conditions" className="underline text-primary" target="_blank">
          T&C{" "}
        </Link>
        ,{" "}
        <Link href="/refund-policy" className="underline text-primary" target="_blank">
          Refund Policy
        </Link>
        , and{" "}
        <Link href="/delivery-policy" className="underline text-primary" target="_blank">
          Delivery Policy
        </Link>
      </p>

      <Button
        onClick={handleSubmit}
        disabled={isSubmitting || !ticket}
        className="w-full rounded-full"
      >
        {isSubmitting
          ? "Submitting..."
          : ticket
            ? "Add Participant"
            : "Select a ticket"}
      </Button>
    </div>
  );
}

export default SingleParticipant;
