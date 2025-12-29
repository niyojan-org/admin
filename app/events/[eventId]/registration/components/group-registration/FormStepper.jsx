"use client";

import React from "react";
import {
  Stepper,
  StepperItem,
  StepperIndicator,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";
import { Separator } from "@/components/ui/separator";

export default function FormStepper({ steps, currentStep, onStepChange }) {
  return (
    <>
      <div className="px-3 sm:px-6 overflow-x-auto">
        <Stepper
          value={currentStep}
          onValueChange={onStepChange}
          className="w-full flex flex-nowrap gap-4 sm:justify-between scrollbar-thin py-1"
        >
          {steps.map((label, i) => (
            <React.Fragment key={i}>
              <StepperItem step={i + 1}>
                <StepperTrigger className="flex flex-col items-center gap-2">
                  <StepperIndicator className="size-6 text-sm font-semibold" />
                  <StepperTitle className="text-xs sm:text-sm whitespace-nowrap">
                    {label}
                  </StepperTitle>
                </StepperTrigger>
              </StepperItem>
              {i < steps.length - 1 && <StepperSeparator />}
            </React.Fragment>
          ))}
        </Stepper>
      </div>
      <Separator className="my-4" />
    </>
  );
}
