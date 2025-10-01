"use client";
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Type, Sparkles } from "lucide-react";

// Import sub-components
import MessageEditor from './MessageEditor';
import AnnouncementSettings from './AnnouncementSettings';
import ScheduleSection from './ScheduleSection';
import ParticipantSelector from './ParticipantSelector';
import TemplateSelector from './TemplateSelector';
import FormActions from './FormActions';
import AnnouncementPreview from './AnnouncementPreview';
import { useAnnouncementForm } from './useAnnouncementForm';

const AnnouncementForm = ({ eventId, onAnnouncementCreated }) => {
    const {
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
    } = useAnnouncementForm(eventId, onAnnouncementCreated);

    return (
        <>
            <DialogHeader className="pb-4">
                <DialogTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Create New Announcement
                </DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="compose" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="compose" className="flex items-center gap-2">
                        <Type className="h-4 w-4" />
                        Compose
                    </TabsTrigger>
                    <TabsTrigger value="templates" className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Templates
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="templates" className="space-y-4">
                    <TemplateSelector
                        templates={templates}
                        selectedTemplate={selectedTemplate}
                        onTemplateSelect={applyTemplate}
                    />
                </TabsContent>

                <TabsContent value="compose" className="space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-sm font-medium">
                                Title *
                            </Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                placeholder="Enter announcement title"
                                className={formErrors.title ? 'border-destructive' : ''}
                            />
                            {formErrors.title && (
                                <p className="text-xs text-destructive">{formErrors.title}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-sm font-medium">
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                placeholder="Optional description for internal reference"
                                rows={2}
                                className="resize-none"
                            />
                        </div>

                        {/* Message Editor */}
                        <MessageEditor
                            value={formData.message}
                            onChange={(value) => handleInputChange('message', value)}
                            error={formErrors.message}
                            messageStats={messageStats}
                            onInsertMarkdown={insertMarkdown}
                            onInsertPlaceholder={insertPlaceholder}
                        />

                        {/* Settings */}
                        <AnnouncementSettings
                            messageType={formData.messageType}
                            priority={formData.priority}
                            selectedCount={formData.participantIds.length}
                            onMessageTypeChange={(value) => handleInputChange('messageType', value)}
                            onPriorityChange={(value) => handleInputChange('priority', value)}
                        />

                        {/* Scheduling */}
                        <ScheduleSection
                            isScheduled={formData.isScheduled}
                            scheduleDateTime={formData.scheduleDateTime}
                            error={formErrors.scheduleDateTime}
                            onScheduleToggle={(checked) => handleInputChange('isScheduled', checked)}
                            onScheduleTimeChange={(value) => handleInputChange('scheduleDateTime', value)}
                        />

                        {/* Participants */}
                        <ParticipantSelector
                            participants={participants}
                            selectedParticipantIds={formData.participantIds}
                            selectedAll={selectedAll}
                            loading={loadingParticipants}
                            error={formErrors.participantIds}
                            onParticipantSelect={handleParticipantSelection}
                            onSelectAll={handleSelectAll}
                        />

                        {/* Actions */}
                        <FormActions
                            onPreview={handlePreview}
                            onSubmit={handleSubmit}
                            loading={loading}
                            isScheduled={formData.isScheduled}
                            canPreview={formData.title && formData.message}
                            disabled={loadingParticipants}
                        />
                    </form>
                </TabsContent>
            </Tabs>

            {showPreview && previewData && (
                <AnnouncementPreview
                    data={previewData}
                    open={showPreview}
                    onClose={() => setShowPreview(false)}
                />
            )}
        </>
    );
};

export default AnnouncementForm;
