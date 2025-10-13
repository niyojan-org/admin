"use client";

import { useContactForm } from "./hooks/useContactForm";
import { ContactFormComponent } from "./components/ContactFormComponent";
import { SuccessModal } from "./components/SuccessModal";
import { ContactMethods } from "./components/ContactMethods";
import { useUserStore } from "@/store/userStore";
import Link from "next/link";

const Contact02Page = () => {
    const { isAuthenticated } = useUserStore();
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
        <div className="">
            <div className="w-full mx-auto space-y-1">
                {!isAuthenticated &&
                    <Link href={'/'} className="underline mb-1">Go back to home</Link>}
                <p className="text-base sm:text-lg text-muted-foreground">
                    We&apos;d love to hear from you. Please fill out this form or shoot us
                    an email.
                </p>
                <div className="grid lg:grid-cols-2 gap-8 md:gap-10">
                    <ContactMethods />

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
                <SuccessModal
                    open={success}
                    onClose={() => resetForm()}
                    data={submittedData}
                    onSendAnother={resetForm}
                />
            </div>
        </div>
    );
};

export default Contact02Page;
