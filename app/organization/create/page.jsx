"use client";
import React, { useState } from "react";
import { useOrgStore } from "@/store/orgStore";
import Step1 from "./steps/BasicOrganization";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";
import Step5 from "./steps/Step5";
import Step6 from "./steps/Step6";
import {
  IconChecks,
  IconInfoCircleFilled,
  IconRosetteDiscountCheckFilled,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function OrganizationWizard() {
  const organization = useOrgStore((s) => s.organization);
  const stepsCompleted = organization?.stepsCompleted || {};
  const router = useRouter();

  const [step, setStep] = useState(0);

  const allStepsCompleted =
    organization &&
    stepsCompleted.basicDetails &&
    stepsCompleted.addressDetails &&
    stepsCompleted.bankDetails &&
    stepsCompleted.documents &&
    stepsCompleted.socialLinks &&
    stepsCompleted.eventPreferences;

  if (allStepsCompleted) {
    return (
      <div className="mx-auto px-10 justify-center items-center flex flex-col py-10 text-center w-full">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <div className="mb-8">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <IconChecks className="text-green" size={40} />
            </div>
            <h1 className="text-3xl font-bold text-navy mb-4">Successfully Registered!</h1>
            <p className="text-lg text-muted-foreground mb-6">
              We have successfully registered your organization{" "}
              <strong>{organization?.name}</strong> with us.
            </p>
          </div>

          {/* Verification Status */}
          {organization?.verified === true ? (
            <div className="bg-green-50 dark:bg-green-900 border border-green-200 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                  <IconRosetteDiscountCheckFilled className="text-green" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-green-800 dark:text-green-50 mb-2">
                Organization Verified
              </h2>
              <p className="text-green-700 dark:text-green-100 mb-4">
                Your organization has been verified and is ready to use our platform.
              </p>
              <button
                onClick={() => router.push("/dashboard")}
                className="px-6 py-3 bg-green-600 cursor-pointer text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Navigate to Dashboard →
              </button>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <IconInfoCircleFilled className="text-yellow" size={20} />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-yellow mb-2">⏳ Pending Verification</h2>
              <p className="text-yellow-700 mb-4">
                {!organization.reqForVerification
                  ? "Your organization registration is complete, but verification is still pending."
                  : "You have requested verification. We will review your organization shortly."}
              </p>
              <button
                onClick={() => {
                  router.push("/register/verify");
                }}
                className="px-6 py-3 cursor-pointer bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
              >
                Raise Verification Request
              </button>
            </div>
          )}

          {/* Additional Info */}
          <div className="text-sm text-muted-foreground">
            <Link href={'/contact'}>Need help? Contact our support team for assistance.</Link>
          </div>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------ */
  /*                STEP CONFIG – add / remove here only                */
  /* ------------------------------------------------------------------ */
  const steps = [
    { key: "basicDetails", label: "Basic Details", component: <Step1 goNext={() => setStep(1)} /> },
    {
      key: "addressDetails",
      label: "Address Details",
      component: <Step2 goNext={() => setStep(2)} goBack={() => setStep(0)} />,
    },
    {
      key: "bankDetails",
      label: "Bank Details",
      component: <Step3 goNext={() => setStep(3)} goBack={() => setStep(1)} />,
    },
    {
      key: "documents",
      label: "Documents",
      component: <Step4 goNext={() => setStep(4)} goBack={() => setStep(2)} />,
    },
    {
      key: "socialLinks",
      label: "Social Links",
      component: <Step5 goNext={() => setStep(5)} goBack={() => setStep(3)} />,
    },
    {
      key: "eventPreferences",
      label: "Preferences",
      component: <Step6 goBack={() => setStep(4)} />,
    },
  ];

  return (
    <div className="mx-auto justify-between h-full pb-20 flex flex-col w-full">
      <div className="mb-6 flex flex-col">
        <h1 className="text-2xl font-bold text-navy">Register your Organization.!</h1>
        <p className="text-gray">
          Just register your organization with us we will manage every thing for your{" "}
        </p>
      </div>

      {/* -------------------------- Stepper UI ------------------------- */}
      <div className="mb-8 flex flex-wrap gap-2 w-full h-full">
        {steps.map((s, index) => {
          const completed = stepsCompleted[s.key];
          const isActive = index === step;
          const canClick = index <= step || completed; // allow back or completed

          return (
            <Button
              key={s.key}
              disabled={!canClick}
              onClick={() => canClick && setStep(index)}
              className={`flex items-center gap-2 rounded px-4 py-2 text-sm font-medium transition `}
            >
              {index + 1}
              <span className="hidden sm:inline">{s.label}</span>
            </Button>
          );
        })}
      </div>

      {/* -------------------- Current Step Component -------------------- */}
      <div className="flex-1">{steps[step].component}</div>

    </div>
  );
}
