import api from "@/lib/api";
import { toast } from "sonner";

export async function uploadResource(file, type = "logo", title = "") {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    formData.append("title", title || file.name);

    const response = await api.post("/resources", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data?.data;
  } catch (error) {
    toast.error(
      error.response.data.message || "Failed to upload the resource.",
    );
    console.error("Error uploading resource:", error);
    throw error;
  }
}

export async function uploadOrganizationLogo(
  file,
  organizationName = "Organization Logo",
) {
  return uploadResource(file, "logo", organizationName);
}

export async function uploadOrganizationCover(
  file,
  organizationName = "Organization Cover",
) {
  return uploadResource(file, "cover-image", organizationName);
}

export async function uploadEventBanner(file, eventName = "Event Banner") {
  return uploadResource(file, "event-banner", eventName);
}

/**
 * Upload organization document
 * @param {File} file - The document file to upload
 * @param {string} documentType - The type of document
 * @returns {Promise} - The upload response with the document URL
 */
export async function uploadDocument(file, documentType = "Document") {
  return uploadResource(file, "document", documentType);
}

export async function deleteResource(resourceId) {
  try {
    const response = await api.delete(`/resources/${resourceId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting resource:", error);
    throw error;
  }
}

const resourcesApi = {
  uploadResource,
  uploadOrganizationLogo,
  uploadOrganizationCover,
  uploadEventBanner,
  uploadDocument,
  deleteResource,
};

export default resourcesApi;
