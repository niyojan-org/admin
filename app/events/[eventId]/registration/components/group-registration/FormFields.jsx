"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import DynamicField from "../DynamicField";

export default function FormFields({
    currentStep,
    groupName,
    setGroupName,
    allFields,
    leaderForm,
    groupMembers,
    fieldErrors,
    fieldRefs,
    onLeaderChange,
    onMemberChange,
    onFieldFocus,
}) {
    return (
        <>
            {currentStep === 1 && (
                <div ref={(el) => (fieldRefs.current["groupName"] = el)}>
                    <Label className="font-medium mb-2">Group Name <span className="text-destructive">*</span></Label>
                    <Input
                        placeholder="Enter group name"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        onFocus={() => onFieldFocus("groupName")}
                        className={`focus-visible:ring-2 focus-visible:ring-primary ${fieldErrors["groupName"]
                            ? "border-destructive focus-visible:ring-destructive"
                            : ""
                            }`}
                    />
                    {fieldErrors["groupName"] && (
                        <p className="text-xs text-destructive mt-1">
                            {fieldErrors["groupName"]}
                        </p>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {allFields.map((f) => {
                    const errorKey =
                        currentStep === 1
                            ? `leader-${f.name}`
                            : `member-${currentStep - 2}-${f.name}`;

                    return (
                        <div
                            key={`${currentStep}-${f.name}`}
                            ref={(el) => (fieldRefs.current[errorKey] = el)}
                        >
                            <DynamicField
                                field={f}
                                value={
                                    currentStep === 1
                                        ? leaderForm[f.name]
                                        : groupMembers[currentStep - 2]?.[f.name]
                                }
                                onChange={(name, val) =>
                                    currentStep === 1
                                        ? onLeaderChange(name, val)
                                        : onMemberChange(currentStep - 2, name, val)
                                }
                                onFocus={onFieldFocus}
                                error={fieldErrors[errorKey]}
                            />
                        </div>
                    );
                })}
            </div>
        </>
    );
}
