"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  IconKey,
  IconEye,
  IconEyeOff,
  IconShield,
  IconCircleCheck,
  IconCircleX,
  IconLock
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import api from "@/lib/api";

export function ChangePassword({ className, user }) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    checks: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
    },
  });

  // Mock last password change date
  const lastPasswordChange = new Date(user?.lastPasswordChange);

  const validatePassword = (password) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const score = Object.values(checks).filter(Boolean).length;
    return { score, checks };
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (field === "newPassword") {
      setPasswordStrength(validatePassword(value));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const getStrengthColor = (score) => {
    if (score <= 2) return "text-destructive";
    if (score <= 3) return "text-yellow-600";
    if (score <= 4) return "text-blue-600";
    return "text-green-600";
  };

  const getStrengthText = (score) => {
    if (score <= 2) return "Weak";
    if (score <= 3) return "Fair";
    if (score <= 4) return "Good";
    return "Strong";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (passwordStrength.score < 4) {
      toast.error("Please choose a stronger password");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/auth/change-password", {
        oldPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      // await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success("Password changed successfully!");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordStrength({ score: 0, checks: {} });
      setIsOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date || isNaN(new Date(date).getTime())) return "Set a password";
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  const getDaysAgo = (date) => {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPasswordAge = () => {
    const daysAgo = getDaysAgo(lastPasswordChange);
    if (daysAgo === 0) return "Today";
    if (daysAgo === 1) return "Yesterday";
    if (daysAgo < 30) return `${daysAgo} days ago`;
    if (daysAgo < 90) return "Recently";
    return "Long time ago";
  };

  const getPasswordAgeVariant = () => {
    const daysAgo = getDaysAgo(lastPasswordChange);
    if (daysAgo < 30) return "default";
    if (daysAgo < 90) return "secondary";
    return "destructive";
  };

  return (
    <Card className={cn("gap-2 h-fit p-2", className)}>
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 text-lg">
          <IconKey className="h-4 w-4" />
          Password & Security
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Password Status Overview */}
        <div className="">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
              <IconLock className="h-4 w-4" />
            </div>
            <div className="flex-1 space-y-2">
              <div>
                <h4 className="font-medium">Password Status</h4>
                <p className="text-sm text-muted-foreground">
                  Last changed on {formatDate(lastPasswordChange)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getPasswordAgeVariant()} className="text-xs">
                  {getPasswordAge()}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <IconShield className="h-3 w-3 mr-1" />
                  Encrypted
                </Badge>
              </div>
            </div>
          </div>



          {/* Change Password Button */}
          <div className="flex justify-end mt-4">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 cursor-pointer">
                  <IconKey className="h-4 w-4" />
                  Change Password
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <IconKey className="h-5 w-5" />
                    Change Password
                  </DialogTitle>
                  <DialogDescription>
                    Enter your current password and choose a new secure password.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <Alert className="py-2">
                    <IconShield className="h-3 w-3" />
                    <AlertDescription className="text-xs">
                      Choose a strong password with at least 8 characters, including uppercase, lowercase, numbers, and special characters.
                    </AlertDescription>
                  </Alert>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Current Password */}
                    <div className="space-y-1">
                      <Label htmlFor="currentPassword" className="text-xs">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showPasswords.current ? "text" : "password"}
                          value={formData.currentPassword}
                          onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                          placeholder="Enter your current password"
                          required
                          className="h-8 pr-8"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-8 w-8 px-0 hover:bg-transparent"
                          onClick={() => togglePasswordVisibility("current")}
                        >
                          {showPasswords.current ? (
                            <IconEyeOff className="h-3 w-3" />
                          ) : (
                            <IconEye className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div className="space-y-1">
                      <Label htmlFor="newPassword" className="text-xs">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showPasswords.new ? "text" : "password"}
                          value={formData.newPassword}
                          onChange={(e) => handleInputChange("newPassword", e.target.value)}
                          placeholder="Enter your new password"
                          required
                          className="h-8 pr-8"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-8 w-8 px-0 hover:bg-transparent"
                          onClick={() => togglePasswordVisibility("new")}
                        >
                          {showPasswords.new ? (
                            <IconEyeOff className="h-3 w-3" />
                          ) : (
                            <IconEye className="h-3 w-3" />
                          )}
                        </Button>
                      </div>

                      {/* Password Strength Indicator */}
                      {formData.newPassword && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Strength:</span>
                            <span className={cn("text-xs font-medium", getStrengthColor(passwordStrength.score))}>
                              {getStrengthText(passwordStrength.score)}
                            </span>
                          </div>

                          <div className="grid grid-cols-5 gap-1 text-xs">
                            {Object.entries(passwordStrength.checks).map(([key, passed]) => (
                              <div key={key} className="flex items-center gap-0.5">
                                {passed ? (
                                  <IconCircleCheck className="h-2 w-2 text-green-600" />
                                ) : (
                                  <IconCircleX className="h-2 w-2 text-muted-foreground" />
                                )}
                                <span className={cn("text-xs", passed ? "text-green-600" : "text-muted-foreground")}>
                                  {key === "length" && "8+"}
                                  {key === "uppercase" && "A-Z"}
                                  {key === "lowercase" && "a-z"}
                                  {key === "number" && "0-9"}
                                  {key === "special" && "@#$"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1">
                      <Label htmlFor="confirmPassword" className="text-xs">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showPasswords.confirm ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                          placeholder="Confirm your new password"
                          required
                          className="h-8 pr-8"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-8 w-8 px-0 hover:bg-transparent"
                          onClick={() => togglePasswordVisibility("confirm")}
                        >
                          {showPasswords.confirm ? (
                            <IconEyeOff className="h-3 w-3" />
                          ) : (
                            <IconEye className="h-3 w-3" />
                          )}
                        </Button>
                      </div>

                      {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                        <p className="text-xs text-destructive">Passwords don't match</p>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setIsOpen(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        size="sm"
                        disabled={
                          isLoading ||
                          !formData.currentPassword ||
                          !formData.newPassword ||
                          !formData.confirmPassword ||
                          formData.newPassword !== formData.confirmPassword ||
                          passwordStrength.score < 4
                        }
                        className="flex-1"
                      >
                        {isLoading ? "Changing..." : "Change Password"}
                      </Button>
                    </div>
                  </form>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}