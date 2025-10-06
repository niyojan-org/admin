"use client";
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Bold, Italic, List, Quote, Code, Strikethrough, Hash, ListOrdered,
    AtSign, FileText, MapPin, CalendarIcon, Clock
} from "lucide-react";

const MessageEditor = ({
    value,
    onChange,
    error,
    messageStats,
    onInsertMarkdown,
    onInsertPlaceholder
}) => {
    const markdownButtons = [
        { label: 'Bold', icon: Bold, syntax: '*text*', shortcut: 'Ctrl+B', desc: 'Bold text' },
        { label: 'Italic', icon: Italic, syntax: '_text_', shortcut: 'Ctrl+I', desc: 'Italic text' },
        { label: 'Strikethrough', icon: Strikethrough, syntax: '~text~', shortcut: '', desc: 'Strikethrough text' },
        { label: 'Monospace', icon: Hash, syntax: '```text```', shortcut: '', desc: 'Monospace text' },
        { label: 'Inline Code', icon: Code, syntax: '`text`', shortcut: '', desc: 'Inline code' },
        { label: 'Bulleted List', icon: List, syntax: '* item', shortcut: '', desc: 'Bulleted list item' },
        { label: 'Numbered List', icon: ListOrdered, syntax: '1. item', shortcut: '', desc: 'Numbered list item' },
        { label: 'Quote', icon: Quote, syntax: '> text', shortcut: '', desc: 'Quote block' },
    ];

    const placeholders = [
        { key: '{participantName}', desc: 'Participant\'s name', icon: AtSign },
        { key: '{eventTitle}', desc: 'Event title', icon: FileText },
        { key: '{venue}', desc: 'Event venue', icon: MapPin },
        { key: '{eventDate}', desc: 'Event date', icon: CalendarIcon },
        { key: '{eventTime}', desc: 'Event time', icon: Clock },
    ];

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <Label htmlFor="message" className="text-sm font-medium">
                    Message *
                </Label>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{messageStats.characters} chars</span>
                    <span>•</span>
                    <span>{messageStats.words} words</span>
                </div>
            </div>

            {/* WhatsApp Markdown Toolbar */}
            <div className="flex flex-wrap gap-1 p-2 border rounded-lg bg-muted/30">
                <div className="text-xs text-muted-foreground mb-1 w-full">
                    WhatsApp Formatting:
                </div>
                {markdownButtons.map((btn) => (
                    <Button
                        key={btn.label}
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => onInsertMarkdown(btn.syntax)}
                        title={`${btn.desc} ${btn.shortcut ? `(${btn.shortcut})` : ''}`}
                    >
                        <btn.icon className="h-3 w-3" />
                    </Button>
                ))}
                <Separator orientation="vertical" className="mx-1 h-6" />
                <div className="flex gap-1">
                    <div className="text-xs text-muted-foreground mr-2 flex items-center">
                        Variables:
                    </div>
                    {placeholders.map((placeholder) => (
                        <Button
                            key={placeholder.key}
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => onInsertPlaceholder(placeholder.key)}
                            title={placeholder.desc}
                        >
                            <placeholder.icon className="h-3 w-3 mr-1" />
                            {placeholder.key.replace(/[{}]/g, '')}
                        </Button>
                    ))}
                </div>
            </div>

            <Textarea
                id="message"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Enter your message. Use WhatsApp formatting and placeholders for personalization."
                rows={4}
                className={`resize-none font-mono text-sm ${error ? 'border-destructive' : ''}`}
            />
            {error && (
                <p className="text-xs text-destructive">{error}</p>
            )}

            <div className="text-xs text-muted-foreground space-y-1">
                <p>💡 WhatsApp Formatting:</p>
                <div className="grid grid-cols-2 gap-1 text-xs">
                    <span>*bold* • _italic_ • ~strikethrough~</span>
                    <span>`inline code` • ```monospace```</span>
                    <span>* bulleted list • 1. numbered list</span>
                    <span>&gt; quote block</span>
                </div>
            </div>
        </div>
    );
};

export default MessageEditor;
