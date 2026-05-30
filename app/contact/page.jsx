'use client';

import { useContactForm } from './hooks/useContactForm';
import { ContactFormComponent } from './components/ContactFormComponent';
import { SuccessModal } from './components/SuccessModal';
import { ContactMethods } from './components/ContactMethods';

const ContactPage = () => {
  const {
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
  } = useContactForm();

  return (
    <div className="h-full">
      <div className="w-full mx-auto space-y-1">
        <div className="grid lg:grid-cols-2 gap-4 md:gap-10">
          <ContactMethods />
          <p className="text-base sm:text-lg text-muted-foreground">
            We&apos;d love to hear from you. Please fill out this form or shoot us an email.
          </p>
          {/* Form */}
          <ContactFormComponent
            formData={formData}
            files={files}
            loading={loading}
            errors={errors}
            onSubmit={handleSubmit}
            onChange={handleChange}
            onFileChange={handleFileChange}
            onRemoveFile={removeFile}
          />
        </div>

        {/* Success Modal */}
        <SuccessModal open={success} onClose={() => resetForm()} data={submittedData} onSendAnother={resetForm} />
      </div>
    </div>
  );
};

export default ContactPage;
