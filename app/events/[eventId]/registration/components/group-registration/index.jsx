"use client";

import React, { useEffect, useState } from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

// Components
import FormStepper from "./FormStepper";
import FormFields from "./FormFields";
import ReviewStep from "./ReviewStep";
import NavigationButtons from "./NavigationButtons";

// Utilities
import { validateCurrentStep, collectValidationErrors } from "./utils/validation";
import { createFieldHandlers, createNavigationHandlers } from "./utils/handlers";
import { useFieldErrors, useFieldRefs } from "./hooks/useFormState";
import useEventRegistrationStore from "@/store/eventRegistration";

export default function GroupMultiStepForm({
    allFields = [],
    onSubmit,
    selectedTicket,
}) {

    const { registrationForm, ticket } = useEventRegistrationStore();

    const { minParticipants = 2, maxParticipants = 5 } = ticket?.groupSettings || {};
    const [currentStep, setCurrentStep] = useState(1);
    const [groupMembers, setGroupMembers] = useState([]);
    const [leaderForm, setLeaderForm] = useState({});
    const [groupName, setGroupName] = useState("");
    const [loading, setLoading] = useState(false);

    const { fieldErrors, clearFieldError, setErrors, clearAllErrors } = useFieldErrors();
    const { fieldRefs, scrollToField } = useFieldRefs();

    // Initialize minimum members
    useEffect(() => {
        if (groupMembers.length < minParticipants - 1) {
            setGroupMembers(Array.from({ length: minParticipants - 1 }, () => ({})));
        }
    }, [minParticipants]);

    const steps = ["Leader", ...groupMembers.map((_, i) => `Member ${i + 2}`), "Review"];
    const requiredFields = allFields.filter((f) => f.required);
    const isReviewStep = currentStep === steps.length;
    const isLastMemberStep = currentStep === groupMembers.length + 1;

    // Field handlers
    const { handleLeaderChange, handleMemberChange } = createFieldHandlers(
        leaderForm,
        setLeaderForm,
        groupMembers,
        setGroupMembers,
        clearFieldError
    );

    // Navigation handlers
    const { nextStep: goNext, prevStep, addMember, removeMember } = createNavigationHandlers(
        currentStep,
        setCurrentStep,
        steps,
        groupMembers,
        setGroupMembers,
        maxParticipants,
        minParticipants
    );

    const handleFieldFocus = (name) => {
        scrollToField(`${currentStep}-${name}`);
    };

    // Validate and move to next step
    const handleNext = () => {
        const { errors, missingFields } = validateCurrentStep(
            currentStep,
            groupName,
            leaderForm,
            groupMembers,
            requiredFields
        );

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            const fieldsList = missingFields.slice(0, 3).join(", ");
            const remaining = missingFields.length > 3 ? ` and ${missingFields.length - 3} more` : "";
            toast.error(`Please fill: ${fieldsList}${remaining}`);
            scrollToField(Object.keys(errors)[0]);
            return;
        }

        goNext();
    };

    // Handle stepper click
    const handleStepChange = (val) => {
        if (val <= currentStep) {
            setCurrentStep(val);
        } else {
            toast.error("Please complete previous steps first.");
        }
    };

    // Final submission
    const handleSubmit = async () => {
        const { errors, missingFields } = collectValidationErrors(
            groupName,
            leaderForm,
            groupMembers,
            requiredFields
        );

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            const fieldsList = missingFields.slice(0, 3).join(", ");
            const remaining = missingFields.length > 3 ? ` and ${missingFields.length - 3} more` : "";
            toast.error(`Please fill: ${fieldsList}${remaining}`);
            scrollToField(Object.keys(errors)[0]);
            return;
        }

        try {
            setLoading(true);
            clearAllErrors();
            await onSubmit({ leader: leaderForm, groupName, groupMembers });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <CardHeader>
                <CardTitle className="text-center text-xl font-semibold">
                    Group Registration
                </CardTitle>
            </CardHeader>

            <FormStepper steps={steps} currentStep={currentStep} onStepChange={handleStepChange} />

            <div className="space-y-6 mt-2">
                {!isReviewStep ? (
                    <FormFields
                        currentStep={currentStep}
                        groupName={groupName}
                        setGroupName={setGroupName}
                        allFields={allFields}
                        leaderForm={leaderForm}
                        groupMembers={groupMembers}
                        fieldErrors={fieldErrors}
                        fieldRefs={fieldRefs}
                        onLeaderChange={handleLeaderChange}
                        onMemberChange={handleMemberChange}
                        onFieldFocus={handleFieldFocus}
                    />
                ) : (
                    <ReviewStep
                        groupName={groupName}
                        leaderForm={leaderForm}
                        groupMembers={groupMembers}
                        allFields={allFields}
                    />
                )}

                {isReviewStep && (
                    <p className="text-sm text-gray-500 my-2">
                        By proceeding, you agree to our{" "}
                        <a href="/terms-and-conditions" className="underline text-primary" target="_blank">
                            T&C
                        </a>
                        ,{" "}
                        <a href="/refund-policy" className="underline text-primary" target="_blank">
                            Refund Policy
                        </a>
                        , and{" "}
                        <a href="/delivery-policy" className="underline text-primary" target="_blank">
                            Delivery Policy
                        </a>
                    </p>
                )}

                <NavigationButtons
                    currentStep={currentStep}
                    isReviewStep={isReviewStep}
                    isLastMemberStep={isLastMemberStep}
                    canAddMember={groupMembers.length + 1 < maxParticipants}
                    canRemoveMember={
                        currentStep > 1 &&
                        currentStep <= groupMembers.length + 1 &&
                        groupMembers.length >= minParticipants
                    }
                    onPrevious={prevStep}
                    onNext={handleNext}
                    onAddMember={addMember}
                    onRemoveMember={() => removeMember(currentStep - 2)}
                    handleSubmit={handleSubmit}
                />
            </div>
        </div>
    );
}
