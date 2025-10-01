'use client'
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    IconEdit,
    IconTrash,
    IconExternalLink,
    IconUser,
    IconEye,
    IconDots,
    IconBrandInstagram,
    IconBrandYoutube,
    IconBrandTwitter,
    IconBrandFacebook,
    IconBrandLinkedin,
    IconBrandTiktok,
    IconWorld
} from '@tabler/icons-react';
import { getPlatformColor, truncateBio } from './speakerUtils';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';

// Platform icons mapping
const platformIcons = {
    instagram: IconBrandInstagram,
    youtube: IconBrandYoutube,
    twitter: IconBrandTwitter,
    facebook: IconBrandFacebook,
    linkedin: IconBrandLinkedin,
    tiktok: IconBrandTiktok,
    website: IconWorld
};

export function GuestSpeakerCard({
    speaker,
    userRole = 'volunteer',
    onEdit,
    onDelete
}) {
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const canEdit = ['owner', 'admin'].includes(userRole);

    const socialLinks = speaker.socialLinks || {};
    const hasLinks = Object.keys(socialLinks).length > 0;
    const hasBio = speaker.bio && speaker.bio.trim().length > 0;

    const SpeakerPreview = ({ isDialog = false }) => (
        <div className={`${isDialog ? 'space-y-6' : ''}`}>
            {/* Header Section */}
            <div className="flex gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    <Avatar className={`${isDialog ? 'w-24 h-24' : 'w-16 h-16 sm:w-20 sm:h-20'} border-2 border-border/50`}>
                        {speaker.photoUrl && speaker.photoUrl.trim() && (
                            <AvatarImage src={speaker.photoUrl} alt={speaker.name} className="object-cover" />
                        )}
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-medium">
                            <IconUser className={`${isDialog ? 'w-12 h-12' : 'w-8 h-8 sm:w-10 sm:h-10'}`} />
                        </AvatarFallback>
                    </Avatar>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <h3 className={`font-semibold text-foreground leading-tight ${isDialog ? 'text-xl mb-2' : 'text-base sm:text-lg'
                                }`}>
                                {speaker.name}
                            </h3>

                            {hasBio && !isDialog && (
                                <p className="text-sm text-muted-foreground leading-relaxed mt-2 line-clamp-2 sm:line-clamp-3">
                                    {truncateBio(speaker.bio, 150)}
                                </p>
                            )}
                        </div>

                        {/* Actions - Desktop */}
                        {!isDialog && (
                            <>
                                {/* Desktop Actions */}
                                <div className="hidden sm:flex gap-1 flex-shrink-0">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setViewDialogOpen(true)}
                                        className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                        title="View details"
                                    >
                                        <IconEye className="w-4 h-4" />
                                    </Button>
                                    {canEdit && (
                                        <>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onEdit(speaker)}
                                                className="h-8 w-8 p-0 text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
                                                title="Edit speaker"
                                            >
                                                <IconEdit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onDelete(speaker)}
                                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                title="Delete speaker"
                                            >
                                                <IconTrash className="w-4 h-4" />
                                            </Button>
                                        </>
                                    )}
                                </div>

                                {/* Mobile Actions */}
                                <div className="sm:hidden flex-shrink-0">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-muted-foreground"
                                            >
                                                <IconDots className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-32">
                                            <DropdownMenuItem onClick={() => setViewDialogOpen(true)}>
                                                <IconEye className="w-4 h-4 mr-2" />
                                                View
                                            </DropdownMenuItem>
                                            {canEdit && (
                                                <>
                                                    <DropdownMenuItem onClick={() => onEdit(speaker)}>
                                                        <IconEdit className="w-4 h-4 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => onDelete(speaker)}
                                                        className="text-destructive focus:text-destructive"
                                                    >
                                                        <IconTrash className="w-4 h-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Bio Section - Dialog Only */}
            {isDialog && hasBio && (
                <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Biography</h4>
                    <p className="text-sm text-foreground leading-relaxed">
                        {speaker.bio}
                    </p>
                </div>
            )}

            {/* Social Links */}
            {hasLinks && (
                <div className={`space-y-2 ${isDialog ? '' : 'mt-4'}`}>
                    {isDialog && (
                        <h4 className="text-sm font-medium text-muted-foreground">Social Links</h4>
                    )}
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(socialLinks).map(([platform, url]) => {
                            if (!url) return null;

                            const IconComponent = platformIcons[platform] || IconWorld;
                            const platformColor = getPlatformColor(platform);

                            return (
                                <Badge
                                    key={platform}
                                    variant="secondary"
                                    className="text-xs px-2.5 py-1.5 h-auto hover:scale-105 cursor-pointer transition-all duration-200 group"
                                    onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
                                    style={{
                                        borderColor: platformColor + '30',
                                        backgroundColor: platformColor + '08',
                                        color: platformColor
                                    }}
                                >
                                    <IconComponent className="w-3.5 h-3.5 mr-1.5" />
                                    <span className="capitalize font-medium">{platform}</span>
                                    <IconExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Badge>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <>
            <Card className="group transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 border-border/50 bg-gradient-to-br from-card to-card/80">
                <CardContent className="">
                    <SpeakerPreview />
                </CardContent>
            </Card>

            {/* View Dialog */}
            <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-lg">
                            <div className="p-1.5 rounded-full bg-primary/10">
                                <IconUser className="w-5 h-5 text-primary" />
                            </div>
                            Speaker Profile
                        </DialogTitle>
                    </DialogHeader>

                    <ScrollArea className="max-h-[70vh] pr-4">
                        <div className="space-y-6">
                            <SpeakerPreview isDialog={true} />

                            {canEdit && (
                                <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-border/50">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setViewDialogOpen(false);
                                            onEdit(speaker);
                                        }}
                                        className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200"
                                    >
                                        <IconEdit className="w-4 h-4" />
                                        Edit Speaker
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setViewDialogOpen(false);
                                            onDelete(speaker);
                                        }}
                                        className="flex items-center gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30"
                                    >
                                        <IconTrash className="w-4 h-4" />
                                        Delete Speaker
                                    </Button>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default GuestSpeakerCard;
