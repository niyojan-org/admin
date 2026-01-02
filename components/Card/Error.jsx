"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  IconRefresh,
  IconHome,
  IconArrowLeft,
  IconCalendarOff
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import {
  errorConfigs,
  statusCodeConfigs,
  defaultErrorConfig,
  sizeClasses,
  colorClasses
} from "./error-data";

const ErrorCard = ({
  error,
  onRetry,
  onGoHome,
  onGoBack,
  onBrowseEvents,
  className,
  showActions = true,
  size = "md" // sm, md, lg
}) => {
  // Helper function to get error icon and message
  const getErrorDisplay = (error) => {
    // Handle string errors
    if (typeof error === 'string') {
      return {
        ...defaultErrorConfig,
        message: error
      };
    }

    // Extract error information from API response structure
    const errorCode = error?.error?.code || error?.code || error?.status;
    const apiMessage = error?.message; // Main API message
    const apiDetails = error?.error?.details; // Detailed error message from API

    // Check error configs first
    let config = errorConfigs[errorCode];

    // If not found, check status code configs
    if (!config) {
      config = statusCodeConfigs[errorCode];
    }

    // If still not found, use default
    if (!config) {
      config = { ...defaultErrorConfig };
    }

    // Priority for message: API message > config message
    const finalMessage = apiMessage || config.message;

    // Priority for details: API details > config details
    const finalDetails = apiDetails || config.details;

    // Return config with API messages taking priority
    return {
      icon: config.icon,
      title: config.title,
      color: config.color,
      message: finalMessage,
      details: finalDetails
    };
  };

  const errorDisplay = getErrorDisplay(error);
  const ErrorIcon = errorDisplay.icon;

  const currentSize = sizeClasses[size];
  const currentColor = colorClasses[errorDisplay.color];

  return (
    <div className={cn("w-full flex items-center justify-center min-h-[60vh]", className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full"
      >
        <Card className={cn(
          "w-full shadow-lg border border-border rounded-xl gap-2",
          "bg-card text-card-foreground overflow-hidden",
          currentSize.container,
          "mx-auto"
        )}>
          <CardHeader className="text-center ">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 10 }}
              className={cn(
                "mx-auto rounded-full flex items-center justify-center mb-4",
                currentSize.iconContainer,
                currentColor.bg,
                currentColor.border,
                "border"
              )}
            >
              <ErrorIcon className={cn(currentSize.icon, currentColor.icon)} />
            </motion.div>
            <CardTitle className={cn(currentSize.title, "font-bold", currentColor.title)}>
              {errorDisplay.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="text-center space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <p className={cn("text-foreground font-medium", currentSize.message)}>
                {errorDisplay.message}
              </p>

              {errorDisplay.details && (
                <p className={cn("text-muted-foreground mt-2", currentSize.details)}>
                  {errorDisplay.details}
                </p>
              )}
            </motion.div>

            {showActions && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-3 pt-4 justify-center"
              >
                {onRetry && (
                  <Button
                    onClick={onRetry}
                    className={cn(
                      "flex items-center gap-2 rounded-full",
                      "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                  >
                    <IconRefresh size={16} />
                    Try Again
                  </Button>
                )}

                {onGoBack && (
                  <Button
                    variant="outline"
                    onClick={onGoBack}
                    className="flex items-center gap-2 rounded-full"
                  >
                    <IconArrowLeft size={16} />
                    Go Back
                  </Button>
                )}

                {onBrowseEvents && (
                  <Button
                    variant="outline"
                    onClick={onBrowseEvents}
                    className="flex items-center gap-2 rounded-full"
                  >
                    <IconCalendarOff size={16} />
                    Browse Events
                  </Button>
                )}

                {onGoHome && (
                  <Button
                    variant="ghost"
                    onClick={onGoHome}
                    className="flex items-center gap-2 rounded-full"
                  >
                    <IconHome size={16} />
                    Home
                  </Button>
                )}
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ErrorCard;