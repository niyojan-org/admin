import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import api from '@/lib/api';

/**
 * Component for selecting event participants
 */
export const ParticipantSelector = ({ eventId, selectedIds, onChange, disabled }) => {
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchParticipants();
    }, [eventId]);

    const fetchParticipants = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch participants from API
            const response = await api.get(`/events/admin/participant/${eventId}?limit=1000`);
            setParticipants(response.data.participants || []);
        } catch (err) {
            console.error('Error fetching participants:', err);
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const filteredParticipants = participants.filter((p) => {
        const query = searchQuery.toLowerCase();
        return (
            p.name?.toLowerCase().includes(query) ||
            p.email?.toLowerCase().includes(query) ||
            p.phone?.includes(query)
        );
    });

    const handleSelectAll = () => {
        if (selectedIds.length === filteredParticipants.length) {
            onChange([]);
        } else {
            onChange(filteredParticipants.map((p) => p._id));
        }
    };

    const handleToggle = (participantId) => {
        if (selectedIds.includes(participantId)) {
            onChange(selectedIds.filter((id) => id !== participantId));
        } else {
            onChange([...selectedIds, participantId]);
        }
    };

    if (loading) {
        return (
            <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertDescription>
                    Failed to load participants: {error}
                </AlertDescription>
            </Alert>
        );
    }

    if (participants.length === 0) {
        return (
            <Alert>
                <AlertDescription>
                    No participants found for this event.
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="space-y-3 border rounded-lg p-4">
            {/* Search */}
            <Input
                placeholder="Search participants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={disabled}
            />

            {/* Select All */}
            <div className="flex items-center justify-between border-b pb-2">
                <Label className="text-sm font-medium">
                    {selectedIds.length} of {filteredParticipants.length} selected
                </Label>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                    disabled={disabled || filteredParticipants.length === 0}
                >
                    {selectedIds.length === filteredParticipants.length ? 'Deselect All' : 'Select All'}
                </Button>
            </div>

            {/* Participants List */}
            <ScrollArea className="h-64">
                {filteredParticipants.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                        No participants match your search.
                    </p>
                ) : (
                    <div className="space-y-2">
                        {filteredParticipants.map((participant) => (
                            <div
                                key={participant._id}
                                className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50"
                            >
                                <Checkbox
                                    id={participant._id}
                                    checked={selectedIds.includes(participant._id)}
                                    onCheckedChange={() => handleToggle(participant._id)}
                                    disabled={disabled}
                                />
                                <Label
                                    htmlFor={participant._id}
                                    className="flex-1 cursor-pointer"
                                >
                                    <div className="flex flex-col">
                                        <span className="font-medium">{participant.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {participant.email}
                                            {participant.phone && ` • ${participant.phone}`}
                                        </span>
                                    </div>
                                </Label>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>

            {/* Warning for max limit */}
            {selectedIds.length > 1000 && (
                <Alert variant="destructive">
                    <AlertDescription>
                        Maximum 1000 participants allowed per announcement.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
};
