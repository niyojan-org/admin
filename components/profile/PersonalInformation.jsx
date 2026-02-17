"use client";

import { useState } from "react";
import { useUserStore } from "@/store/userStore";
import { PersonalInfoView } from "./PersonalInfoView";
import { PersonalInfoEdit } from "./PersonalInfoEdit";
import { cn } from "@/lib/utils";

export function PersonalInformation({ onUpdate, className }) {
  const { user } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (formData) => {
    await onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className={cn("h-full", className)}>
      {isEditing ? (
        <PersonalInfoEdit
          user={user}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <PersonalInfoView
          user={user}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}