"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconFileText, IconCheck, IconClock, IconExternalLink } from "@tabler/icons-react";

export function DocumentCard({ doc }) {
    return (
        <Card className="border-2 rounded-lg p-4 hover:border-primary/50 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                        <IconFileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm mb-2 truncate">{doc.type}</p>
                        <Badge variant={doc.verified ? "default" : "secondary"} className="text-xs">
                            {doc.verified ? (
                                <>
                                    <IconCheck className="w-3 h-3 mr-1" /> Verified
                                </>
                            ) : (
                                <>
                                    <IconClock className="w-3 h-3 mr-1" /> Pending
                                </>
                            )}
                        </Badge>
                    </div>
                </div>
                {doc.url && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                        asChild
                    >
                        <a href={doc.url} target="_blank" rel="noopener noreferrer">
                            <IconExternalLink className="w-4 h-4" />
                        </a>
                    </Button>
                )}
            </div>
        </Card>
    );
}

export function DocumentsSection({ documents }) {
    if (!documents || documents.length === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc, index) => (
                <DocumentCard key={doc._id || index} doc={doc} />
            ))}
        </div>
    );
}
