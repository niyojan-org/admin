import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Simple obfuscation for draft data (not cryptographic security, but prevents casual viewing)
// For truly sensitive data, implement server-side encryption
const obfuscate = (data) => {
  try {
    const jsonString = JSON.stringify(data);
    // Simple base64 encoding with a twist
    return btoa(encodeURIComponent(jsonString).split('').reverse().join(''));
  } catch (error) {
    console.error("Obfuscation error:", error);
    return null;
  }
};

const deobfuscate = (obfuscatedData) => {
  try {
    if (!obfuscatedData) return null;
    // Reverse the obfuscation
    const decoded = decodeURIComponent(atob(obfuscatedData).split('').reverse().join(''));
    return JSON.parse(decoded);
  } catch (error) {
    console.error("Deobfuscation error:", error);
    return null;
  }
};

// Custom storage with obfuscation
const secureStorage = {
  getItem: (name) => {
    if (typeof window === "undefined") return null;
    const obfuscatedData = localStorage.getItem(name);
    if (!obfuscatedData) return null;
    const decodedData = deobfuscate(obfuscatedData);
    return decodedData ? JSON.stringify(decodedData) : null;
  },
  setItem: (name, value) => {
    if (typeof window === "undefined") return;
    const parsedValue = JSON.parse(value);
    const obfuscatedData = obfuscate(parsedValue);
    if (obfuscatedData) {
      localStorage.setItem(name, obfuscatedData);
    }
  },
  removeItem: (name) => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(name);
  },
};

// Initial state for organization form
const initialOrganizationState = {
  // Step 1: Basic Information
  name: "",
  email: "",
  phone: "",
  category: "",
  subCategory: "",
  description: "",
  logo: "",

  // Step 2: Address Details
  address: {
    locality: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  },

  // Step 3: Support Contact
  supportContact: {
    name: "",
    email: "",
    phone: "",
  },

  // Step 4: Social Links
  socialLinks: {
    website: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: "",
    youtube: "",
    blog: "",
  },

  // Step 5: Documents
  documents: [],

  // Step 6: Bank Details (Optional)
  bankDetails: {
    accountHolderName: "",
    bankName: "",
    branchName: "",
    accountNumber: "",
    ifscCode: "",
    upiId: "",
  },
};

// Form steps configuration
export const ORGANIZATION_STEPS = [
  {
    id: 1,
    title: "Basic Information",
    description: "Organization name, email, and category",
    fields: ["name", "email", "phone", "category", "subCategory", "description", "logo"],
  },
  {
    id: 2,
    title: "Address Details",
    description: "Location and contact address",
    fields: ["address"],
  },
  {
    id: 3,
    title: "Support Contact",
    description: "Primary support person details",
    fields: ["supportContact"],
  },
  {
    id: 4,
    title: "Social Links",
    description: "Website and social media profiles",
    fields: ["socialLinks"],
  },
  {
    id: 5,
    title: "Documents",
    description: "Upload required documents",
    fields: ["documents"],
  },
  {
    id: 6,
    title: "Bank Details",
    description: "Payment and banking information (Optional)",
    fields: ["bankDetails"],
  },
  {
    id: 7,
    title: "Review",
    description: "Review and submit your organization",
    fields: [],
  },
];

// Category options
export const CATEGORY_OPTIONS = [
  { value: "college", label: "College/University" },
  { value: "corporate", label: "Corporate" },
  { value: "nonprofit", label: "Non-Profit Organization" },
  { value: "startup", label: "Startup" },
  { value: "government", label: "Government" },
  { value: "other", label: "Other" },
];

// Document type options
export const DOCUMENT_TYPE_OPTIONS = [
  { value: "Certificate of Incorporation", label: "Certificate of Incorporation" },
  { value: "GST Certificate", label: "GST Certificate" },
  { value: "PAN Card", label: "PAN Card" },
  { value: "Business License", label: "Business License" },
  { value: "Tax Exemption Certificate", label: "Tax Exemption Certificate" },
  { value: "Other", label: "Other" },
];

export const useOrganizationCreationStore = create(
  persist(
    (set, get) => ({
      // Form data
      organizationDraft: { ...initialOrganizationState },

      // Current step (1-based)
      currentStep: 1,

      // Draft management
      isDraftSaved: false,
      lastSavedAt: null,
      hasDraft: false,

      // Step completion tracking
      completedSteps: [],

      // Validation errors per step
      stepErrors: {},

      // Loading states
      isSubmitting: false,
      isSavingDraft: false,

      // Edit mode from review
      editingFromReview: false,
      returnToStep: null,

      // Set current step
      setCurrentStep: (step) => set({ currentStep: step }),

      // Go to next step
      nextStep: () =>
        set((state) => {
          const nextStep = Math.min(state.currentStep + 1, ORGANIZATION_STEPS.length);
          const completedSteps = state.completedSteps.includes(state.currentStep)
            ? state.completedSteps
            : [...state.completedSteps, state.currentStep];
          return { currentStep: nextStep, completedSteps };
        }),

      // Go to previous step
      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 1),
        })),

      // Update entire draft
      setOrganizationDraft: (data) =>
        set({
          organizationDraft: data,
          isDraftSaved: false,
          hasDraft: true,
        }),

      // Update specific field
      updateField: (field, value) =>
        set((state) => ({
          organizationDraft: {
            ...state.organizationDraft,
            [field]: value,
          },
          isDraftSaved: false,
          hasDraft: true,
        })),

      // Update nested field (e.g., address.city)
      updateNestedField: (parent, field, value) =>
        set((state) => ({
          organizationDraft: {
            ...state.organizationDraft,
            [parent]: {
              ...state.organizationDraft[parent],
              [field]: value,
            },
          },
          isDraftSaved: false,
          hasDraft: true,
        })),

      // Update multiple fields at once
      updateFields: (fields) =>
        set((state) => ({
          organizationDraft: {
            ...state.organizationDraft,
            ...fields,
          },
          isDraftSaved: false,
          hasDraft: true,
        })),

      // Document management
      addDocument: (document) =>
        set((state) => ({
          organizationDraft: {
            ...state.organizationDraft,
            documents: [...state.organizationDraft.documents, document],
          },
          isDraftSaved: false,
          hasDraft: true,
        })),

      updateDocument: (index, document) =>
        set((state) => ({
          organizationDraft: {
            ...state.organizationDraft,
            documents: state.organizationDraft.documents.map((doc, i) =>
              i === index ? { ...doc, ...document } : doc
            ),
          },
          isDraftSaved: false,
          hasDraft: true,
        })),

      removeDocument: (index) =>
        set((state) => ({
          organizationDraft: {
            ...state.organizationDraft,
            documents: state.organizationDraft.documents.filter((_, i) => i !== index),
          },
          isDraftSaved: false,
          hasDraft: true,
        })),

      // Set step errors
      setStepErrors: (step, errors) =>
        set((state) => ({
          stepErrors: {
            ...state.stepErrors,
            [step]: errors,
          },
        })),

      // Clear step errors
      clearStepErrors: (step) =>
        set((state) => {
          const newErrors = { ...state.stepErrors };
          delete newErrors[step];
          return { stepErrors: newErrors };
        }),

      // Mark step as completed
      markStepComplete: (step) =>
        set((state) => ({
          completedSteps: state.completedSteps.includes(step)
            ? state.completedSteps
            : [...state.completedSteps, step],
        })),

      // Check if step is completed
      isStepComplete: (step) => get().completedSteps.includes(step),

      // Save draft
      saveDraft: () => {
        set({
          isDraftSaved: true,
          lastSavedAt: new Date().toISOString(),
          isSavingDraft: false,
        });
      },

      // Auto-save draft (debounced in component)
      autoSaveDraft: () => {
        set({
          isDraftSaved: true,
          lastSavedAt: new Date().toISOString(),
        });
      },

      // Edit from review mode
      editFromReview: (step) =>
        set({
          editingFromReview: true,
          returnToStep: ORGANIZATION_STEPS.length, // Review step
          currentStep: step,
        }),

      // Return to review after editing
      returnToReview: () =>
        set((state) => ({
          editingFromReview: false,
          currentStep: state.returnToStep || ORGANIZATION_STEPS.length,
          returnToStep: null,
        })),

      // Cancel edit from review
      cancelEditFromReview: () =>
        set((state) => ({
          editingFromReview: false,
          currentStep: state.returnToStep || ORGANIZATION_STEPS.length,
          returnToStep: null,
        })),

      // Clear draft and reset form
      clearDraft: () => {
        set({
          organizationDraft: { ...initialOrganizationState },
          currentStep: 1,
          isDraftSaved: false,
          lastSavedAt: null,
          hasDraft: false,
          completedSteps: [],
          stepErrors: {},
          editingFromReview: false,
          returnToStep: null,
        });
      },

      // Set submitting state
      setIsSubmitting: (isSubmitting) => set({ isSubmitting }),

      // Get form data for submission (clean up empty optional fields)
      getSubmissionData: () => {
        const { organizationDraft } = get();
        const data = { ...organizationDraft };

        // Remove empty optional fields
        if (!data.subCategory) delete data.subCategory;
        if (!data.description) delete data.description;
        if (!data.logo) delete data.logo;

        // Clean up social links - remove empty ones but keep at least website
        const cleanedSocialLinks = {};
        Object.entries(data.socialLinks).forEach(([key, value]) => {
          if (value && value.trim()) {
            cleanedSocialLinks[key] = value.trim();
          }
        });
        data.socialLinks = cleanedSocialLinks;

        // Clean up bank details - remove if all fields are empty
        const hasBankDetails = Object.values(data.bankDetails).some(
          (value) => value && value.trim()
        );
        if (!hasBankDetails) {
          delete data.bankDetails;
        }

        // Remove empty documents
        data.documents = data.documents.filter(
          (doc) => doc.type && doc.url
        );

        return data;
      },
    }),
    {
      name: "organization-creation-draft",
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({
        organizationDraft: state.organizationDraft,
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
        lastSavedAt: state.lastSavedAt,
        hasDraft: state.hasDraft,
      }),
    }
  )
);
