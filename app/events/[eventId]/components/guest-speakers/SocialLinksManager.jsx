'use client'
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { IconPlus, IconX, IconExternalLink } from '@tabler/icons-react';
import { socialPlatforms, getPlatformColor, validateSocialPlatform } from './speakerUtils';

export function SocialLinksManager({
    socialLinks = {},
    onChange,
    disabled = false
}) {
    const availablePlatforms = socialPlatforms.filter(platform => !socialLinks[platform]);
    const [selectedPlatform, setSelectedPlatform] = useState(availablePlatforms[0] || socialPlatforms[0]);
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');

    const addSocialLink = () => {
        if (!url.trim() || !selectedPlatform) return;
        
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            setError('URL must start with http:// or https://');
            return;
        }

        if (!validateSocialPlatform(selectedPlatform, url)) {
            setError(`Invalid ${selectedPlatform} URL format`);
            return;
        }

        // Check if platform already exists
        if (socialLinks[selectedPlatform]) {
            setError(`${selectedPlatform} link already exists`);
            return;
        }

        onChange({
            ...socialLinks,
            [selectedPlatform]: url.trim()
        });
        
        setUrl('');
        setError('');
        
        // Set next available platform
        const nextAvailable = socialPlatforms.find(platform => 
            !socialLinks[platform] && platform !== selectedPlatform
        );
        if (nextAvailable) {
            setSelectedPlatform(nextAvailable);
        }
    };

    const removeSocialLink = (platform) => {
        const newLinks = { ...socialLinks };
        delete newLinks[platform];
        onChange(newLinks);

        // If the removed platform was selected, set it as current selection
        if (!selectedPlatform || socialLinks[selectedPlatform]) {
            setSelectedPlatform(platform);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSocialLink();
        }
    };

    const canAddMore = availablePlatforms.length > 0;

    return (
        <div className="space-y-4">
            <div>
                <Label className="text-sm font-medium">Social Media Links</Label>
                <p className="text-xs text-muted-foreground mt-1">
                    Add social media profiles to showcase the speaker's online presence and build credibility
                </p>
            </div>

            {/* Add new link */}
            {canAddMore && (
                <div className="space-y-2">
                    <div className="flex gap-2">
                        <Select 
                            value={selectedPlatform} 
                            onValueChange={setSelectedPlatform}
                            disabled={disabled}
                        >
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {availablePlatforms.map(platform => (
                                    <SelectItem key={platform} value={platform}>
                                        <span className="capitalize">{platform}</span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        
                        <Input
                            value={url}
                            onChange={(e) => {
                                setUrl(e.target.value);
                                setError('');
                            }}
                            onKeyPress={handleKeyPress}
                            placeholder={`Enter ${selectedPlatform} URL (e.g., https://${selectedPlatform}.com/username)`}
                            disabled={disabled}
                            className="flex-1"
                        />
                        
                        <Button
                            type="button"
                            onClick={addSocialLink}
                            disabled={disabled || !url.trim() || socialLinks[selectedPlatform]}
                            size="sm"
                            className="px-3"
                        >
                            <IconPlus className="w-4 h-4" />
                        </Button>
                    </div>

                    {error && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-destructive flex-shrink-0 mt-1.5"></span>
                            {error}
                        </p>
                    )}
                </div>
            )}

            {/* Display added links */}
            {Object.keys(socialLinks).length > 0 && (
                <div className="space-y-3">
                    <Label className="text-xs text-muted-foreground">Added Links ({Object.keys(socialLinks).length})</Label>
                    <div className="grid gap-2">
                        {Object.entries(socialLinks).map(([platform, linkUrl]) => (
                            <div
                                key={platform}
                                className="flex items-center gap-3 p-3 rounded-lg border bg-card/50"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span 
                                            className="text-sm font-medium capitalize"
                                            style={{ color: getPlatformColor(platform) }}
                                        >
                                            {platform}
                                        </span>
                                        <Badge
                                            variant="secondary"
                                            className="text-xs px-1.5 py-0.5"
                                            style={{ 
                                                borderColor: getPlatformColor(platform) + '40',
                                                backgroundColor: getPlatformColor(platform) + '10',
                                                color: getPlatformColor(platform)
                                            }}
                                        >
                                            Active
                                        </Badge>
                                    </div>
                                    <a 
                                        href={linkUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-xs text-muted-foreground hover:text-primary truncate block"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {linkUrl}
                                        <IconExternalLink className="w-3 h-3 ml-1 inline" />
                                    </a>
                                </div>
                                
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeSocialLink(platform)}
                                    disabled={disabled}
                                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                >
                                    <IconX className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!canAddMore && Object.keys(socialLinks).length === socialPlatforms.length && (
                <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
                    All supported social platforms have been added. You can remove existing links to add different ones.
                </div>
            )}
        </div>
    );
}

export default SocialLinksManager;
