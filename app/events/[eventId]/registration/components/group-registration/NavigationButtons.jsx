"use client";

import { Button } from "@/components/ui/button";
import useEventRegistrationStore from "@/store/eventRegistration";
import { IconArrowLeft, IconArrowRight, IconLoader3, IconPlus } from "@tabler/icons-react";
import { is } from "date-fns/locale/is";
import { XCircle } from "lucide-react";

export default function NavigationButtons({
  currentStep,
  isReviewStep,
  isLastMemberStep,
  canAddMember,
  canRemoveMember,
  onPrevious,
  onNext,
  onAddMember,
  onRemoveMember,
  handleSubmit,
}) {

  const { ticket, isSubmitting } = useEventRegistrationStore();
  return (
    <>
      <div className="flex flex-wrap justify-between gap-3 pt-4 w-full h-full">
        {currentStep > 1 && (
          <Button variant="outline" onClick={onPrevious} className={'h-full'}>
            <IconArrowLeft /> Previous
          </Button>
        )}

        {!isReviewStep && isLastMemberStep && canAddMember && (
          <Button variant="secondary" onClick={onAddMember} className="flex-1 h-full">
            <IconPlus /> Add Member
          </Button>
        )}

        {!isReviewStep && (
          <Button onClick={onNext} className="flex-1 h-full">
            Next <IconArrowRight />
          </Button>
        )}

        {isReviewStep && (
          <Button
            size="lg"
            className="flex-1"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? <IconLoader3 className="animate-spin" /> : "Add Group"}
          </Button>
        )}
      </div>

      {canRemoveMember && (
        <Button
          variant="destructive"
          size="sm"
          onClick={onRemoveMember}
          className="flex items-center gap-2 rounded-full mt-4"
        >
          <XCircle className="w-4 h-4" />
          Remove Member
        </Button>
      )}
    </>
  );
}
