"use client";

import { useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

export const useContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    category: "general",
  });

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [submittedData, setSubmittedData] = useState(null);

  // Validation rules
  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "name":
        if (!value.trim()) {
          newErrors.name = "Name is required";
        } else if (value.length > 100) {
          newErrors.name = "Name cannot exceed 100 characters";
        } else {
          delete newErrors.name;
        }
        break;

      case "email":
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!value.trim()) {
          newErrors.email = "Email is required";
        } else if (!emailRegex.test(value)) {
          newErrors.email = "Please enter a valid email address";
        } else {
          delete newErrors.email;
        }
        break;

      case "phone":
        if (value && value.trim()) {
          const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
          if (!phoneRegex.test(value)) {
            newErrors.phone = "Please enter a valid phone number";
          } else {
            delete newErrors.phone;
          }
        } else {
          delete newErrors.phone;
        }
        break;

      case "subject":
        if (value && value.length > 200) {
          newErrors.subject = "Subject cannot exceed 200 characters";
        } else {
          delete newErrors.subject;
        }
        break;

      case "message":
        if (!value.trim()) {
          newErrors.message = "Message is required";
        } else if (value.length > 5000) {
          newErrors.message = "Message cannot exceed 5000 characters";
        } else {
          delete newErrors.message;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validateFiles = (selectedFiles) => {
    // Validate file count
    if (selectedFiles.length > 5) {
      toast.error("Maximum 5 files allowed");
      return false;
    }

    // Validate individual file size (10MB)
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    for (let file of selectedFiles) {
      if (file.size > maxFileSize) {
        toast.error(`${file.name} exceeds 10MB limit`);
        return false;
      }
    }

    // Validate total size (25MB)
    const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
    const maxTotalSize = 25 * 1024 * 1024; // 25MB
    if (totalSize > maxTotalSize) {
      toast.error("Total file size cannot exceed 25MB");
      return false;
    }

    // Validate file types
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    for (let file of selectedFiles) {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} is not a supported file type`);
        return false;
      }
    }

    return true;
  };

  const handleFileChange = (selectedFiles) => {
    if (validateFiles(selectedFiles)) {
      setFiles(selectedFiles);
      return true;
    }
    return false;
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      // Append form fields
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          data.append(key, formData[key]);
        }
      });

      // Append source information
      data.append("source", "website");

      // Append files
      files.forEach((file) => {
        data.append("attachments", file);
      });

      const response = await api.post("/contact", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Store submitted data for success modal
      setSubmittedData(response.data.data);
      setSuccess(true);
      toast.success("Message sent successfully!");

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        category: "general",
      });
      setFiles([]);
      setErrors({});
    } catch (error) {
      console.error("Contact form submission error:", error);
      toast.error(error.response?.data?.message || "Failed to submit form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      category: "general",
    });
    setFiles([]);
    setErrors({});
    setSuccess(false);
    setSubmittedData(null);
  };

  return {
    formData,
    files,
    loading,
    success,
    errors,
    submittedData,
    handleChange,
    handleFileChange,
    removeFile,
    handleSubmit,
    resetForm,
  };
};
