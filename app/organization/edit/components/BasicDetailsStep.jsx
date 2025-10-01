"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IconLoader2, IconBuilding, IconInfoCircle } from "@tabler/icons-react";

export default function BasicDetailsStep({ orgData, onSave, saving }) {
  const [formData, setFormData] = useState({
    name: orgData?.name || "",
    email: orgData?.email || "",
    phone: orgData?.phone || "",
    alternativePhone: orgData?.alternativePhone || "",
    category: orgData?.category || "",
    subCategory: orgData?.subCategory || "",
    website: orgData?.website || "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ 
      ...prev, 
      [name]: value,
      ...(name === 'category' ? { subCategory: '' } : {})
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name?.trim()) newErrors.name = "Organization name is required";
    if (!formData.email?.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.phone?.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.subCategory) newErrors.subCategory = "Sub-category is required";
    
    if (formData.alternativePhone && !/^\+?[\d\s-]{10,}$/.test(formData.alternativePhone)) {
      newErrors.alternativePhone = "Please enter a valid phone number";
    }
    
    if (formData.website && !/^https?:\/\/.+\..+/.test(formData.website)) {
      newErrors.website = "Please enter a valid website URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

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

  return (
    <div className="space-y-6">
      <Alert>
        <IconInfoCircle className="h-4 w-4" />
        <AlertDescription>
          Ensure all information matches your official registration documents. 
          Changes to basic details may require re-verification.
        </AlertDescription>
      </Alert>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Organization Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter organization name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Organization Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter organization email"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            {/* Alternative Phone */}
            <div className="space-y-2">
              <Label htmlFor="alternativePhone">Alternative Phone</Label>
              <Input
                id="alternativePhone"
                name="alternativePhone"
                type="tel"
                value={formData.alternativePhone}
                onChange={handleChange}
                placeholder="Enter alternative phone"
                className={errors.alternativePhone ? "border-red-500" : ""}
              />
              {errors.alternativePhone && (
                <p className="text-sm text-red-500">{errors.alternativePhone}</p>
              )}
            </div>

            {/* Website */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="website">Website URL</Label>
              <Input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://your-website.com"
                className={errors.website ? "border-red-500" : ""}
              />
              {errors.website && (
                <p className="text-sm text-red-500">{errors.website}</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="college">College</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                  <SelectItem value="nonprofit">Non Profit</SelectItem>
                  <SelectItem value="startup">Startup</SelectItem>
                  <SelectItem value="government">Government</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-500">{errors.category}</p>
              )}
            </div>

            {/* Sub Category */}
            <div className="space-y-2">
              <Label>Sub Category *</Label>
              <Select 
                value={formData.subCategory} 
                onValueChange={(value) => handleSelectChange('subCategory', value)}
                disabled={!formData.category}
              >
                <SelectTrigger className={errors.subCategory ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select sub-category" />
                </SelectTrigger>
                <SelectContent>
                  {getSubCategories(formData.category).map((subCat) => (
                    <SelectItem 
                      key={subCat} 
                      value={subCat.toLowerCase().replace(/\s+/g, "-")}
                    >
                      {subCat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.subCategory && (
                <p className="text-sm text-red-500">{errors.subCategory}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={saving}>
          {saving && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
}
