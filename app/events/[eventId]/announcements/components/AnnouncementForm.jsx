import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { IconBulb, IconBrandWhatsapp, IconMail, IconDeviceMobile } from '@tabler/icons-react';
import { ParticipantSelector } from './ParticipantSelector';
import { validateAnnouncementForm } from '../utils/helpers';

/**
 * Form for creating/editing announcements
 */
export const AnnouncementForm = ({ eventId, onSubmit, onCancel, loading, initialData }) => {
    const [formData, setFormData] = useState(initialData || {
        title: '',
        message: '',
        messageType: 'both',
        priority: 'normal',
        participantIds: [],
        isScheduled: false,
        scheduleDateTime: '',
    });

    const [errors, setErrors] = useState({});
    const [showPreview, setShowPreview] = useState(false);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error for this field
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const validation = validateAnnouncementForm(formData);
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        onSubmit(formData);
    };

    const previewMessage = formData.message
        .replace(/{name}/g, 'John Doe')
        .replace(/{email}/g, 'john@example.com');

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
                <Label htmlFor="title">
                    Title <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Enter announcement title"
                    maxLength={200}
                    disabled={loading}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{errors.title && <span className="text-red-500">{errors.title}</span>}</span>
                    <span>{formData.title.length}/200</span>
                </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
                <Label htmlFor="message">
                    Message <span className="text-red-500">*</span>
                </Label>
                <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    placeholder="Enter your message. Use {name} and {email} for personalization."
                    rows={6}
                    maxLength={1000}
                    disabled={loading}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{errors.message && <span className="text-red-500">{errors.message}</span>}</span>
                    <span>{formData.message.length}/1000</span>
                </div>

                {/* Placeholder hints */}
                <Alert className="border-blue-200 bg-blue-50">
                    <IconBulb className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-xs text-blue-900">
                        Available placeholders: <code className="bg-blue-100 px-1 rounded">{'{name}'}</code>{' '}
                        <code className="bg-blue-100 px-1 rounded">{'{email}'}</code>
                    </AlertDescription>
                </Alert>

                {/* Preview Toggle */}
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                    disabled={!formData.message}
                >
                    {showPreview ? 'Hide' : 'Show'} Preview
                </Button>

                {showPreview && formData.message && (
                    <div className="p-3 bg-muted rounded-lg border">
                        <p className="text-sm font-medium mb-2">Preview:</p>
                        <p className="text-sm whitespace-pre-wrap text-foreground">{previewMessage}</p>
                    </div>
                )}
            </div>

            {/* Message Type */}
            <div className="space-y-2">
                <Label htmlFor="messageType">
                    Message Type <span className="text-red-500">*</span>
                </Label>
                <Select
                    value={formData.messageType}
                    onValueChange={(value) => handleChange('messageType', value)}
                    disabled={loading}
                >
                    <SelectTrigger id="messageType">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="whatsapp">
                            <div className="flex items-center gap-2">
                                <IconBrandWhatsapp className="h-4 w-4 text-green-600" />
                                <span>WhatsApp Only</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="email">
                            <div className="flex items-center gap-2">
                                <IconMail className="h-4 w-4 text-blue-600" />
                                <span>Email Only</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="both">
                            <div className="flex items-center gap-2">
                                <IconDeviceMobile className="h-4 w-4 text-purple-600" />
                                <span>WhatsApp & Email</span>
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
                {errors.messageType && (
                    <p className="text-xs text-red-500">{errors.messageType}</p>
                )}
            </div>

            {/* Priority */}
            <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                    value={formData.priority}
                    onValueChange={(value) => handleChange('priority', value)}
                    disabled={loading}
                >
                    <SelectTrigger id="priority">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Participant Selector */}
            <div className="space-y-2">
                <Label>
                    Participants <span className="text-red-500">*</span>
                </Label>
                <ParticipantSelector
                    eventId={eventId}
                    selectedIds={formData.participantIds}
                    onChange={(ids) => handleChange('participantIds', ids)}
                    disabled={loading}
                />
                {errors.participantIds && (
                    <p className="text-xs text-red-500">{errors.participantIds}</p>
                )}
            </div>

            {/* Schedule Option */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label htmlFor="isScheduled">Schedule for later</Label>
                    <Switch
                        id="isScheduled"
                        checked={formData.isScheduled}
                        onCheckedChange={(checked) => handleChange('isScheduled', checked)}
                        disabled={loading}
                    />
                </div>

                {formData.isScheduled && (
                    <div className="space-y-2">
                        <Label htmlFor="scheduleDateTime">
                            Schedule Date & Time <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="scheduleDateTime"
                            type="datetime-local"
                            value={formData.scheduleDateTime}
                            onChange={(e) => handleChange('scheduleDateTime', e.target.value)}
                            min={new Date().toISOString().slice(0, 16)}
                            disabled={loading}
                        />
                        {errors.scheduleDateTime && (
                            <p className="text-xs text-red-500">{errors.scheduleDateTime}</p>
                        )}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : formData.isScheduled ? 'Schedule Announcement' : 'Send Announcement'}
                </Button>
            </div>
        </form>
    );
};
