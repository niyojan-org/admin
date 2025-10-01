import { IconCircleCheck, IconAlertTriangle, IconCircleX } from '@tabler/icons-react';

export const getStatusColor = (status) => {
  switch (status) {
    case "verified":
    case true:
      return "bg-green-100 text-green-800 border-green-200";
    case "pending":
    case false:
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "blocked":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const getStatusIcon = (status) => {
  switch (status) {
    case "verified":
    case true:
      return <IconCircleCheck className="h-4 w-4" />;
    case "pending":
    case false:
      return <IconAlertTriangle className="h-4 w-4" />;
    case "blocked":
      return <IconCircleX className="h-4 w-4" />;
    default:
      return <IconAlertTriangle className="h-4 w-4" />;
  }
};

export const calculateProfileCompletion = (orgData) => {
  if (!orgData?.stepsCompleted) return 0;
  const steps = orgData.stepsCompleted;
  const totalSteps = Object.keys(steps).length;
  const completedSteps = Object.values(steps).filter(Boolean).length;
  return (completedSteps / totalSteps) * 100;
};

export const isProfileComplete = (orgData) => {
  return calculateProfileCompletion(orgData) === 100;
};
