"use client";
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import api from '@/lib/api';
import moment from 'moment';

export const useAnnouncementForm = (eventId, onAnnouncementCreated) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        message: '',
        participantIds: [],
        messageType: 'both',
        priority: 'normal',
        isScheduled: false,
        scheduleDateTime: ''
    });

    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingParticipants, setLoadingParticipants] = useState(true);
    const [showPreview, setShowPreview] = useState(false);
    const [previewData, setPreviewData] = useState(null);
    const [selectedAll, setSelectedAll] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [messageStats, setMessageStats] = useState({ characters: 0, words: 0 });
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState('');

    useEffect(() => {
        fetchParticipants();
        loadTemplates();
    }, [eventId]);

    useEffect(() => {
        const text = formData.message;
        setMessageStats({
            characters: text.length,
            words: text.trim() ? text.trim().split(/\s+/).length : 0
        });
    }, [formData.message]);

    const loadTemplates = async () => {
        try {
            const response = await api.get(`/event/admin/announcement/${eventId}/templates`);
            if (response.data.success) {
                setTemplates(response.data.template.templates || []);
            }
        } catch (error) {
            console.error("Error loading templates:", error);
        }
    };

    const fetchParticipants = async () => {
        setLoadingParticipants(true);
        try {
            const response = await api.get(`/event/admin/participant/${eventId}`);
            if (response.data.success) {
                setParticipants(response.data.participants || []);
            }
        } catch (error) {
            handleApiError(error, "Failed to fetch participants");
        } finally {
            setLoadingParticipants(false);
        }
    };

    const handleApiError = (error, defaultMessage) => {
        const errorData = error.response?.data;
        
        if (errorData) {
            toast.error(errorData.message || defaultMessage);
            
            if (errorData.error?.details) {
                toast.error(errorData.error.details);
            }
            
            if (errorData.error?.code) {
                switch (errorData.error.code) {
                    case 'INVALID_PARTICIPANTS':
                        setFormErrors(prev => ({ ...prev, participantIds: "Some selected participants are invalid" }));
                        break;
                    case 'INVALID_SCHEDULE_TIME':
                        setFormErrors(prev => ({ ...prev, scheduleDateTime: "Invalid schedule time" }));
                        break;
                    default:
                        break;
                }
            }
        } else {
            toast.error(defaultMessage);
        }
        
        console.error("API Error:", error);
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        if (formErrors[field]) {
            setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const applyTemplate = (templateId) => {
        const template = templates.find(t => t.id === templateId);
        if (template) {
            setFormData(prev => ({
                ...prev,
                title: template.title,
                message: template.message,
                priority: template.priority || 'normal'
            }));
            setSelectedTemplate(templateId);
            toast.success("Template applied successfully");
        }
    };

    const insertMarkdown = (syntax) => {
        const textarea = document.getElementById('message');
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = formData.message.substring(start, end);

        let replacement;
        if (syntax.includes('text')) {
            replacement = syntax.replace('text', selectedText || 'text');
        } else {
            replacement = selectedText ? `${syntax} ${selectedText}` : syntax;
        }

        const newMessage = formData.message.substring(0, start) + replacement + formData.message.substring(end);
        handleInputChange('message', newMessage);

        setTimeout(() => {
            textarea.focus();
            const newPosition = start + replacement.length;
            textarea.setSelectionRange(newPosition, newPosition);
        }, 0);
    };

    const insertPlaceholder = (placeholder) => {
        const textarea = document.getElementById('message');
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        const newMessage = formData.message.substring(0, start) + placeholder + formData.message.substring(end);
        handleInputChange('message', newMessage);

        setTimeout(() => {
            textarea.focus();
            const newPosition = start + placeholder.length;
            textarea.setSelectionRange(newPosition, newPosition);
        }, 0);
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.title.trim()) {
            errors.title = "Title is required";
        }

        if (!formData.message.trim()) {
            errors.message = "Message is required";
        }

        if (formData.participantIds.length === 0) {
            errors.participantIds = "Please select at least one participant";
        }

        if (formData.isScheduled && !formData.scheduleDateTime) {
            errors.scheduleDateTime = "Please select a schedule date and time";
        }

        if (formData.isScheduled && formData.scheduleDateTime) {
            const scheduleTime = moment(formData.scheduleDateTime);
            if (scheduleTime.isBefore(moment())) {
                errors.scheduleDateTime = "Schedule time must be in the future";
            }
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleParticipantSelection = (participantId, checked) => {
        setFormData(prev => ({
            ...prev,
            participantIds: checked
                ? [...prev.participantIds, participantId]
                : prev.participantIds.filter(id => id !== participantId)
        }));
    };

    const handleSelectAll = (checked) => {
        setSelectedAll(checked);
        setFormData(prev => ({
            ...prev,
            participantIds: checked ? participants.map(p => p._id) : []
        }));
    };

    const handlePreview = async () => {
        if (!validateForm()) {
            toast.error("Please fix the form errors before previewing");
            return;
        }

        try {
            const response = await api.post(`/event/admin/announcement/${eventId}/preview`, {
                title: formData.title,
                message: formData.message,
                participantIds: formData.participantIds.slice(0, 3),
                sampleSize: 3
            });

            if (response.data.success) {
                setPreviewData(response.data.data);
                setShowPreview(true);
            }
        } catch (error) {
            handleApiError(error, "Failed to generate preview");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fix the form errors before submitting");
            return;
        }

        setLoading(true);
        setFormErrors({});

        try {
            const response = await api.post(`/event/admin/announcement/${eventId}`, formData);

            if (response.data.success) {
                toast.success(
                    formData.isScheduled
                        ? "Announcement scheduled successfully!"
                        : "Announcement sent successfully!"
                );

                onAnnouncementCreated(response.data.announcement);

                // Reset form
                setFormData({
                    title: '',
                    description: '',
                    message: '',
                    participantIds: [],
                    messageType: 'both',
                    priority: 'normal',
                    isScheduled: false,
                    scheduleDateTime: ''
                });
                setSelectedAll(false);
                setSelectedTemplate('');
            }
        } catch (error) {
            handleApiError(error, "Failed to create announcement");
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        participants,
        loading,
        loadingParticipants,
        showPreview,
        previewData,
        selectedAll,
        formErrors,
        messageStats,
        templates,
        selectedTemplate,
        handleInputChange,
        applyTemplate,
        insertMarkdown,
        insertPlaceholder,
        handleParticipantSelection,
        handleSelectAll,
        handlePreview,
        handleSubmit,
        setShowPreview
    };
};
