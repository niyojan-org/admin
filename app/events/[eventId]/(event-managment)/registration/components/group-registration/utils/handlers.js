/**
 * Handlers for group registration form interactions
 */

import { toast } from "sonner";

export function createFieldHandlers(
  leaderForm,
  setLeaderForm,
  groupMembers,
  setGroupMembers,
  clearFieldError
) {
  const handleLeaderChange = (name, value) => {
    setLeaderForm((prev) => ({ ...prev, [name]: value }));
    clearFieldError(`leader-${name}`);
  };

  const handleMemberChange = (index, name, value) => {
    setGroupMembers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [name]: value };
      return updated;
    });
    clearFieldError(`member-${index}-${name}`);
  };

  return { handleLeaderChange, handleMemberChange };
}

export function createNavigationHandlers(
  currentStep,
  setCurrentStep,
  steps,
  groupMembers,
  setGroupMembers,
  maxParticipants,
  minParticipants
) {
  const nextStep = () => {
    setCurrentStep((s) => Math.min(s + 1, steps.length));
  };

  const prevStep = () => {
    setCurrentStep((s) => Math.max(s - 1, 1));
  };

  const addMember = () => {
    if (groupMembers.length < maxParticipants - 1) {
      setGroupMembers((prev) => [...prev, {}]);
      setCurrentStep(groupMembers.length + 2);
    }
  };

  const removeMember = (index) => {
    if (groupMembers.length < minParticipants - 1) {
      toast.error("At least two members are required.");
      return;
    }
    const updated = [...groupMembers];
    updated.splice(index, 1);
    setGroupMembers(updated);
    setCurrentStep((current) => Math.min(current, updated.length + 1));
    toast.info("Member removed");
  };

  return { nextStep, prevStep, addMember, removeMember };
}
