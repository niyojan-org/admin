"use client";
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  IconCircleCheck, 
  IconAlertTriangle, 
  IconBuilding,
  IconMapPin,
  IconCreditCard,
  IconWorld,
  IconSettings,
  IconFileText,
  IconTrendingUp,
  IconBulb
} from "@tabler/icons-react";

const DataCompletionStep = ({ orgData, onSectionEdit }) => {
  if (!orgData || !orgData.stepsCompleted) {
    return null;
  }

  const calculateCompletion = () => {
    const steps = orgData.stepsCompleted;
    const totalSteps = Object.keys(steps).length;
    const completedSteps = Object.values(steps).filter(Boolean).length;
    return {
      percentage: Math.round((completedSteps / totalSteps) * 100),
      completed: completedSteps,
      total: totalSteps
    };
  };

  const getStepDetails = () => {
    const stepConfig = {
      basicDetails: {
        label: "Basic Details",
        description: "Organization name, contact info, category",
        icon: IconBuilding,
        importance: "high"
      },
      addressDetails: {
        label: "Address Details", 
        description: "Physical address information",
        icon: IconMapPin,
        importance: "high"
      },
      bankDetails: {
        label: "Bank Details",
        description: "Banking information for payments",
        icon: IconCreditCard,
        importance: "high"
      },
      socialLinks: {
        label: "Social Links",
        description: "Website and social media profiles",
        icon: IconWorld,
        importance: "medium"
      },
      eventPreferences: {
        label: "Event Preferences",
        description: "Event hosting settings",
        icon: IconSettings,
        importance: "medium"
      },
      documents: {
        label: "Documents",
        description: "Verification documents",
        icon: IconFileText,
        importance: "high"
      }
    };

    // Filter out steps that don't exist in stepsCompleted and map to step details
    return Object.entries(orgData.stepsCompleted)
      .filter(([key]) => stepConfig[key]) // Only include steps that have configuration
      .map(([key, completed]) => ({
        key,
        completed,
        ...stepConfig[key]
      }))
      .sort((a, b) => {
        // Sort by completion status (incomplete first), then by importance
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        const importanceOrder = { high: 0, medium: 1, low: 2 };
        return importanceOrder[a.importance] - importanceOrder[b.importance];
      });
  };

  const completion = calculateCompletion();
  const steps = getStepDetails();
  const incompleteSteps = steps.filter(step => !step.completed);
  const isProfileComplete = completion.percentage === 100;

  const getCompletionColor = (percentage) => {
    if (percentage === 100) return "text-secondary";
    if (percentage >= 75) return "text-primary";
    if (percentage >= 50) return "text-chart-4";
    return "text-destructive";
  };

  const getCompletionMessage = (percentage) => {
    if (percentage === 100) {
      return {
        title: "🎉 Profile Complete!",
        description: "Your organization profile is fully set up. You're ready to create and manage events.",
        type: "success"
      };
    }
    if (percentage >= 75) {
      return {
        title: "Almost There!",
        description: "Just a few more steps to complete your profile and unlock all features.",
        type: "info"
      };
    }
    if (percentage >= 50) {
      return {
        title: "Good Progress",
        description: "You're halfway through setting up your profile. Continue to enhance your organization's presence.",
        type: "warning"
      };
    }
    return {
      title: "Let's Get Started",
      description: "Complete your profile to build trust with attendees and access all platform features.",
      type: "default"
    };
  };

  const message = getCompletionMessage(completion.percentage);

  return (
    <div className="space-y-6">
      {/* Completion Overview */}
      <Card className={isProfileComplete ? "border-secondary bg-secondary/50" : ""}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconTrendingUp className="h-5 w-5" />
            Profile Completion
          </CardTitle>
          <CardDescription>
            Track your progress and complete missing information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className={`text-lg font-bold ${getCompletionColor(completion.percentage)}`}>
                {completion.percentage}%
              </span>
            </div>
            <Progress 
              value={completion.percentage} 
              className="h-3"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{completion.completed} of {completion.total} sections completed</span>
              <span>{completion.total - completion.completed} remaining</span>
            </div>
          </div>

          {/* Completion Message */}
          <Alert className={
            message.type === "success" ? "border-secondary bg-secondary/10" :
            message.type === "info" ? "border-primary bg-primary/10" :
            message.type === "warning" ? "border-chart-4 bg-chart-4/10" :
            "border-border bg-muted/50"
          }>
            <IconBulb className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-medium">{message.title}</p>
                <p className="text-sm">{message.description}</p>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Step-by-Step Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Section Details</CardTitle>
          <CardDescription>
            Review and complete each section of your profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.key}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                    step.completed 
                      ? "bg-secondary/10 border-secondary" 
                      : step.importance === "high"
                      ? "bg-destructive/10 border-destructive"
                      : "bg-chart-4/10 border-chart-4"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      step.completed 
                        ? "bg-secondary text-secondary" 
                        : step.importance === "high"
                        ? "bg-destructive/20 text-destructive"
                        : "bg-chart-4/10 text-chart-4"
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{step.label}</p>
                        {step.importance === "high" && !step.completed && (
                          <Badge variant="destructive" className="text-xs">Required</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {step.completed ? (
                      <Badge variant="default" className="gap-1">
                        <IconCircleCheck className="h-3 w-3" />
                        Complete
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1">
                        <IconAlertTriangle className="h-3 w-3" />
                        Incomplete
                      </Badge>
                    )}
                    {!step.completed && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onSectionEdit && onSectionEdit(step.key)}
                      >
                        Complete
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Benefits of Completion */}
      {!isProfileComplete && (
        <Card>
          <CardHeader>
            <CardTitle>Benefits of Complete Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <IconCircleCheck className="h-4 w-4 text-green-600" />
                <span>Build trust with event attendees</span>
              </div>
              <div className="flex items-center gap-2">
                <IconCircleCheck className="h-4 w-4 text-green-600" />
                <span>Faster verification process</span>
              </div>
              <div className="flex items-center gap-2">
                <IconCircleCheck className="h-4 w-4 text-green-600" />
                <span>Access to all platform features</span>
              </div>
              <div className="flex items-center gap-2">
                <IconCircleCheck className="h-4 w-4 text-green-600" />
                <span>Higher search visibility</span>
              </div>
              <div className="flex items-center gap-2">
                <IconCircleCheck className="h-4 w-4 text-green-600" />
                <span>Better payment processing</span>
              </div>
              <div className="flex items-center gap-2">
                <IconCircleCheck className="h-4 w-4 text-green-600" />
                <span>Professional appearance</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DataCompletionStep;
