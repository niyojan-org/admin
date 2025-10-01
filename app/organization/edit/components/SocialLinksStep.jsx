"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IconLoader2, IconWorld, IconInfoCircle, IconBrandFacebook, IconBrandInstagram, IconBrandTwitter, IconBrandLinkedin } from "@tabler/icons-react";

export default function SocialLinksStep({ orgData, onSave, saving }) {
  const [formData, setFormData] = useState({
    website: orgData?.website || "",
    facebook: orgData?.socialLinks?.facebook || "",
    instagram: orgData?.socialLinks?.instagram || "",
    twitter: orgData?.socialLinks?.twitter || "",
    linkedin: orgData?.socialLinks?.linkedin || "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.website && !/^https?:\/\/.+\..+/.test(formData.website)) {
      newErrors.website = "Please enter a valid website URL";
    }
    
    if (formData.facebook && !/^https?:\/\/(www\.)?facebook\.com\/.+/.test(formData.facebook)) {
      newErrors.facebook = "Please enter a valid Facebook URL";
    }
    
    if (formData.instagram && !/^https?:\/\/(www\.)?instagram\.com\/.+/.test(formData.instagram)) {
      newErrors.instagram = "Please enter a valid Instagram URL";
    }
    
    if (formData.twitter && !/^https?:\/\/(www\.)?(twitter\.com|x\.com)\/.+/.test(formData.twitter)) {
      newErrors.twitter = "Please enter a valid Twitter/X URL";
    }
    
    if (formData.linkedin && !/^https?:\/\/(www\.)?linkedin\.com\/.+/.test(formData.linkedin)) {
      newErrors.linkedin = "Please enter a valid LinkedIn URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const socialLinks = {
        facebook: formData.facebook,
        instagram: formData.instagram,
        twitter: formData.twitter,
        linkedin: formData.linkedin,
      };
      
      // Remove empty values
      Object.keys(socialLinks).forEach(key => {
        if (!socialLinks[key]) delete socialLinks[key];
      });
      
      onSave({ 
        website: formData.website,
        socialLinks 
      });
    }
  };

  return (
    <div className="space-y-6">
      <Alert>
        <IconInfoCircle className="h-4 w-4" />
        <AlertDescription>
          Add your organization's online presence to build trust and credibility with event attendees.
        </AlertDescription>
      </Alert>

      <Card>
        <CardContent className="pt-6 space-y-4">
          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="website" className="flex items-center gap-2">
              <IconWorld className="h-4 w-4" />
              Website URL
            </Label>
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

          {/* Facebook */}
          <div className="space-y-2">
            <Label htmlFor="facebook" className="flex items-center gap-2">
              <IconBrandFacebook className="h-4 w-4 text-blue-600" />
              Facebook Page
            </Label>
            <Input
              id="facebook"
              name="facebook"
              type="url"
              value={formData.facebook}
              onChange={handleChange}
              placeholder="https://facebook.com/yourpage"
              className={errors.facebook ? "border-red-500" : ""}
            />
            {errors.facebook && (
              <p className="text-sm text-red-500">{errors.facebook}</p>
            )}
          </div>

          {/* Instagram */}
          <div className="space-y-2">
            <Label htmlFor="instagram" className="flex items-center gap-2">
              <IconBrandInstagram className="h-4 w-4 text-pink-600" />
              Instagram Profile
            </Label>
            <Input
              id="instagram"
              name="instagram"
              type="url"
              value={formData.instagram}
              onChange={handleChange}
              placeholder="https://instagram.com/yourprofile"
              className={errors.instagram ? "border-red-500" : ""}
            />
            {errors.instagram && (
              <p className="text-sm text-red-500">{errors.instagram}</p>
            )}
          </div>

          {/* Twitter */}
          <div className="space-y-2">
            <Label htmlFor="twitter" className="flex items-center gap-2">
              <IconBrandTwitter className="h-4 w-4 text-blue-400" />
              Twitter/X Profile
            </Label>
            <Input
              id="twitter"
              name="twitter"
              type="url"
              value={formData.twitter}
              onChange={handleChange}
              placeholder="https://twitter.com/yourprofile"
              className={errors.twitter ? "border-red-500" : ""}
            />
            {errors.twitter && (
              <p className="text-sm text-red-500">{errors.twitter}</p>
            )}
          </div>

          {/* LinkedIn */}
          <div className="space-y-2">
            <Label htmlFor="linkedin" className="flex items-center gap-2">
              <IconBrandLinkedin className="h-4 w-4 text-blue-700" />
              LinkedIn Page
            </Label>
            <Input
              id="linkedin"
              name="linkedin"
              type="url"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/company/yourcompany"
              className={errors.linkedin ? "border-red-500" : ""}
            />
            {errors.linkedin && (
              <p className="text-sm text-red-500">{errors.linkedin}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={saving}>
          {saving && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Social Links
        </Button>
      </div>
    </div>
  );
}
