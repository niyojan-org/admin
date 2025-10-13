"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useOrgStore } from "@/store/orgStore";
import api from "@/lib/api";
import { toast } from "sonner";
import { IconInfoSquareRounded } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export default function Step1({ goNext }) {
  const { organization, setOrganization } = useOrgStore();

  // State for guidelines dialog
  const [showGuidelinesDialog, setShowGuidelinesDialog] = useState(false);

  // Initialize form data with organization data if available
  const [formData, setFormData] = useState({
    name: organization?.name || "",
    email: organization?.email || "",
    phone: organization?.phone || "",
    alternativePhone: organization?.alternativePhone || "",
    category: organization?.category || "",
    subCategory: organization?.subCategory || "",
  });

  // Update form data when organization changes
  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name || "",
        email: organization.email || "",
        phone: organization.phone || "",
        alternativePhone: organization.alternativePhone || "",
        category: organization.category || "",
        subCategory: organization.subCategory || "",
      });
    }
  }, [organization]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle category change
  const handleCategoryChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
      subCategory: "", // Reset subcategory when category changes
    }));
  };

  // Handle subcategory change
  const handleSubCategoryChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      subCategory: value,
    }));
  };

  // Define subcategories for each category
  const getSubCategories = (category) => {
    const subCategories = {
      college: [
        "Engineering College",
        "Medical College",
        "Arts & Science College",
        "Business School",
        "Law College",
        "Agricultural College",
        "Technical Institute",
        "Community College",
        "University",
      ],
      corporate: [
        "Technology",
        "Finance & Banking",
        "Healthcare",
        "Manufacturing",
        "Retail",
        "Consulting",
        "Media & Entertainment",
        "Real Estate",
        "Energy",
        "Transportation",
      ],
      nonprofit: [
        "Education",
        "Health & Medical",
        "Environmental",
        "Social Services",
        "Arts & Culture",
        "Religious",
        "Animal Welfare",
        "Human Rights",
        "Community Development",
        "International Aid",
      ],
      startup: [
        "Fintech",
        "Healthtech",
        "Edtech",
        "E-commerce",
        "SaaS",
        "Mobile Apps",
        "AI/ML",
        "IoT",
        "Blockchain",
        "Greentech",
      ],
      government: [
        "Federal Agency",
        "State Government",
        "Local Government",
        "Military",
        "Public Safety",
        "Education Department",
        "Health Department",
        "Transportation",
        "Environmental",
        "Social Services",
      ],
      other: [
        "Professional Association",
        "Trade Organization",
        "Research Institute",
        "Cultural Institution",
        "Sports Organization",
        "Religious Organization",
        "Community Group",
        "International Organization",
      ],
    };
    return subCategories[category] || [];
  };

  const handleSubmit = async () => {
    try {
      const response = await api.post("/org/register/basic", { ...formData });
      toast.success(response.data.message || "Basic details has been successfully saved.!");
      setOrganization(response.data.org);
      goNext();
    } catch (error) {
      if (error.response?.data.error?.code === "ORGANIZATION_EXISTS") {
        toast.info("Lets move to next step");
        goNext();
        return;
      }
      toast.error(
        error.response?.data?.message || "Failed to save basic details. Please try again.",
        {
          description:
            error.response.data.error.details ||
            "An error occurred while saving your organization details.",
        }
      );
    }
  };

  return (
    <div className="h-full bg-background rounded border border-border shadow p-2 sm:px-6 md:px-10 flex flex-col justify-between">
      <div className="flex flex-row items-center justify-between gap-6">
        <p className="text-foreground text-sm">
          Let's start with the basic details about your organization
        </p>
        <div className="text-sm text-muted-foreground text-center inline-flex items-start">
          <span className="text-destructive">*</span> Required fields
        </div>
        {/* Info Button */}
        <Dialog open={showGuidelinesDialog} onOpenChange={setShowGuidelinesDialog}>
          <DialogTrigger asChild>
            <Button
              type="button"
              title="Organization Basic Details Guidelines"
              variant={'icon'}
            >
              <IconInfoSquareRounded />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-primary">
                Organization Basic Details Guidelines
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 mt-4">
              {/* General Guidelines */}
              <div className="p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                <h3 className="font-semibold text-primary mb-2">🏢 General Guidelines</h3>
                <ul className="text-sm text-primary space-y-1">
                  <li>• Provide accurate and official information about your organization</li>
                  <li>• Use the exact name as registered with government authorities</li>
                  <li>• Ensure contact details are current and monitored regularly</li>
                  <li>• This information will be used for verification and communication</li>
                </ul>
              </div>

              {/* Field Requirements */}
              <div className="p-4 bg-success/5 rounded-lg border-l-4 border-success">
                <h3 className="font-semibold text-success mb-2">✓ Field Requirements</h3>
                <ul className="text-sm text-success space-y-1">
                  <li>
                    • <strong>Organization Name:</strong> Must match official registration
                    documents
                  </li>
                  <li>
                    • <strong>Email:</strong> Use official organization email address, not
                    personal
                  </li>
                  <li>
                    • <strong>Phone:</strong> Include country code and area code for international
                    format
                  </li>
                  <li>
                    • <strong>Alternative Phone:</strong> Optional backup contact number for
                    better accessibility
                  </li>
                  <li>
                    • <strong>Category:</strong> Select the category that best describes your
                    organization type
                  </li>
                  <li>
                    • <strong>Sub-Category:</strong> Choose the most specific classification
                    available
                  </li>
                </ul>
              </div>

              {/* Category Information */}
              <div className="p-4 bg-secondary/5 rounded-lg border-l-4 border-secondary">
                <h3 className="font-semibold text-secondary mb-2">📋 Category Selection</h3>
                <ul className="text-sm text-secondary space-y-1">
                  <li>
                    • <strong>College:</strong> Educational institutions, universities, schools
                  </li>
                  <li>
                    • <strong>Corporate:</strong> Private companies, businesses, enterprises
                  </li>
                  <li>
                    • <strong>Non Profit:</strong> NGOs, charities, foundations, social
                    organizations
                  </li>
                  <li>
                    • <strong>Startup:</strong> New ventures, tech companies, innovative
                    businesses
                  </li>
                  <li>
                    • <strong>Government:</strong> Public sector, agencies, municipal
                    organizations
                  </li>
                  <li>
                    • <strong>Other:</strong> Associations, clubs, or organizations not covered
                    above
                  </li>
                </ul>
              </div>

              {/* Tips */}
              <div className="p-4 bg-warning/5 rounded-lg border-l-4 border-warning">
                <h3 className="font-semibold text-warning mb-2">💡 Tips</h3>
                <ul className="text-sm text-warning space-y-1">
                  <li>• Double-check spelling and formatting before proceeding</li>
                  <li>
                    • Use full organization name, not abbreviations unless officially registered
                  </li>
                  <li>• Ensure email and phone are accessible for verification purposes</li>
                  <li>
                    • If unsure about category, choose the closest match and contact support
                  </li>
                </ul>
              </div>

              {/* Important Notes */}
              <div className="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
                <h3 className="font-semibold text-destructive mb-2">⚠️ Important</h3>
                <ul className="text-sm text-destructive space-y-1">
                  <li>• All information must be truthful and verifiable</li>
                  <li>• False information may result in registration rejection</li>
                  <li>• Contact details will be used for account verification</li>
                  <li>• Changes to basic details may require re-verification</li>
                </ul>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-0 p-0 bg-transparent mt-3">
        <CardContent className="space-y-2 grid grid-cols-1 sm:grid-cols-2 gap-x-0 sm:gap-x-6">
          {/* Organization Name */}
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="name" className="text-foreground font-semibold text-base">
              Organization Name *
            </Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              placeholder="Enter your organization name"
              className="h-11 border-border focus:border-primary focus:ring-primary"
              required
            />
            {formData.name && formData.name.length < 2 && (
              <p className="text-sm text-destructive mt-1">Name must be at least 2 characters long</p>
            )}
          </div>

          {/* Organization Email */}
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="email" className="text-foreground font-semibold text-base">
              Organization Email *
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              placeholder="Enter your organization email"
              className="h-11 border-border focus:border-primary focus:ring-primary"
              required
            />
            {formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
              <p className="text-sm text-destructive mt-1">Please enter a valid email address</p>
            )}
          </div>

          {/* Organization Phone */}
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="phone" className="text-foreground font-semibold text-base">
              Organization Phone *
            </Label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              placeholder="Enter your organization phone number"
              className="h-11 border-border focus:border-primary focus:ring-primary"
              required
            />
            {formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone) && (
              <p className="text-sm text-destructive mt-1">Please enter a valid phone number</p>
            )}
          </div>

          {/* Alternative Phone */}
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="alternativePhone" className="text-foreground font-semibold text-base">
              Alternative Phone (Optional)
            </Label>
            <Input
              type="tel"
              id="alternativePhone"
              name="alternativePhone"
              value={formData.alternativePhone || ""}
              onChange={handleChange}
              placeholder="Enter alternative phone number"
              className="h-11 border-border focus:border-primary focus:ring-primary"
            />
            {formData.alternativePhone &&
              formData.alternativePhone.length > 0 &&
              !/^\+?[\d\s-]{10,}$/.test(formData.alternativePhone) && (
                <p className="text-sm text-destructive mt-1">Please enter a valid phone number</p>
              )}
          </div>

          {/* Category */}
          <div className="space-y-1 sm:space-y-2 w-full">
            <Label className="text-foreground font-semibold text-base">Select the Category *</Label>
            <Select value={formData.category} onValueChange={handleCategoryChange}>
              <SelectTrigger className="h-11 border-border focus:border-primary focus:ring-primary w-full">
                <SelectValue placeholder="Select the Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel className="text-foreground font-semibold">Organization Type</SelectLabel>
                  <SelectItem value="college">College</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                  <SelectItem value="nonprofit">Non Profit</SelectItem>
                  <SelectItem value="startup">Start up</SelectItem>
                  <SelectItem value="government">Government</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Sub Category - Only show when category is selected */}

          {formData.category && (
            <div className="space-y-1 sm:space-y-2 w-full">
              <Label className="text-foreground font-semibold text-base">Select the Sub-Category *</Label>
              <Select value={formData.subCategory} onValueChange={handleSubCategoryChange}>
                <SelectTrigger className="h-11 border-border focus:border-primary focus:ring-primary w-full">
                  <SelectValue placeholder="Select the Sub-Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel className="text-foreground font-semibold">Sub-Categories</SelectLabel>
                    {getSubCategories(formData.category).map((subCat) => (
                      <SelectItem key={subCat} value={subCat.toLowerCase().replace(/\s+/g, "-")}>
                        {subCat}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="flex justify-end mt-4 sm:mt-6">
        <Button
          className="w-full sm:w-auto"
          onClick={() => {
            if (
              !formData.name ||
              !formData.email ||
              !formData.phone ||
              !formData.category ||
              !formData.subCategory
            ) {
              toast.error("Please fill all required fields before proceeding.");
              return;
            }
            handleSubmit();
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
