"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandYoutube,
  IconWorld,
  IconExternalLink,
  IconNews,
} from "@tabler/icons-react";

const getSocialIcon = (platform) => {
  const icons = {
    facebook: IconBrandFacebook,
    twitter: IconBrandTwitter,
    instagram: IconBrandInstagram,
    linkedin: IconBrandLinkedin,
    youtube: IconBrandYoutube,
    blog: IconNews,
    website: IconWorld,
  };
  return icons[platform.toLowerCase()] || IconWorld;
};

export function SocialLinksSection({ socialLinks, website }) {
  const hasSocialLinks = socialLinks && Object.keys(socialLinks).length > 0;

  if (!website && !hasSocialLinks) {
    return <p className="text-muted-foreground text-sm">No online presence information</p>;
  }

  return (
    <div className="space-y-4">
      {website && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Website</p>
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-primary hover:underline font-medium group"
          >
            <IconWorld className="w-4 h-4" />
            <span className="truncate">{website}</span>
            <IconExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>
      )}

      {website && hasSocialLinks && <Separator />}

      {hasSocialLinks && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Social Media</p>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(socialLinks)
              .filter(([, url]) => url)
              .map(([platform, url]) => {
                const Icon = getSocialIcon(platform);
                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors group border"
                  >
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="capitalize font-medium flex-1">{platform}</span>
                    <IconExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
