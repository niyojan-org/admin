"use client";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText } from "lucide-react";

const TemplateSelector = ({ 
    templates, 
    selectedTemplate, 
    onTemplateSelect 
}) => {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick Templates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                {templates.length > 0 ? (
                    <ScrollArea className="h-32">
                        <div className="space-y-2">
                            {templates.map((template) => (
                                <div
                                    key={template.id}
                                    className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50 ${
                                        selectedTemplate === template.id 
                                            ? 'border-primary bg-primary/5' 
                                            : 'border-border'
                                    }`}
                                    onClick={() => onTemplateSelect(template.id)}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="text-sm font-medium">{template.title}</h4>
                                        <Badge variant="outline" className="text-xs">
                                            {template.category}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                        {template.previewMessage || template.message}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                ) : (
                    <div className="text-center py-4 text-muted-foreground">
                        <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No templates available</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default TemplateSelector;
