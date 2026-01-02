/**
 * Validates group registration form data
 */

export function validateGroupName(groupName) {
  return groupName && groupName.trim() !== "";
}

export function validateLeaderData(leaderForm, requiredFields) {
  return requiredFields.every((f) => !!leaderForm[f.name]);
}

export function validateMemberData(memberData, requiredFields) {
  return requiredFields.every((f) => !!memberData[f.name]);
}

export function collectValidationErrors(groupName, leaderForm, groupMembers, requiredFields) {
  const errors = {};
  const missingFields = [];

  // Validate group name
  if (!validateGroupName(groupName)) {
    errors["groupName"] = "Group name is required";
    missingFields.push("Group Name");
  }

  // Validate leader fields
  requiredFields.forEach((f) => {
    if (!leaderForm[f.name]) {
      errors[`leader-${f.name}`] = `${f.label} is required`;
      missingFields.push(`Leader's ${f.label}`);
    }
  });

  // Validate member fields
  groupMembers.forEach((member, idx) => {
    requiredFields.forEach((f) => {
      if (!member[f.name]) {
        errors[`member-${idx}-${f.name}`] = `${f.label} is required`;
        missingFields.push(`Member ${idx + 2}'s ${f.label}`);
      }
    });
  });

  return { errors, missingFields };
}

export function validateCurrentStep(currentStep, groupName, leaderForm, groupMembers, requiredFields) {
  const errors = {};
  const missingFields = [];

  if (currentStep === 1) {
    // Validate group name
    if (!validateGroupName(groupName)) {
      errors["groupName"] = "Group name is required";
      missingFields.push("Group Name");
    }
    // Validate leader fields
    requiredFields.forEach((f) => {
      if (!leaderForm[f.name]) {
        errors[`leader-${f.name}`] = `${f.label} is required`;
        missingFields.push(f.label);
      }
    });
  } else if (currentStep > 1) {
    // Validate current member
    const memberIndex = currentStep - 2;
    requiredFields.forEach((f) => {
      if (!groupMembers[memberIndex]?.[f.name]) {
        errors[`member-${memberIndex}-${f.name}`] = `${f.label} is required`;
        missingFields.push(f.label);
      }
    });
  }

  return { errors, missingFields };
}
