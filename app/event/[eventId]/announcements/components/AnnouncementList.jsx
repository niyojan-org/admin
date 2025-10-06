"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Search, Filter, RefreshCw, Eye, RotateCcw, Trash2,
    Clock, CheckCircle, XCircle, AlertCircle, Calendar,
    Mail, MessageCircle, Smartphone
} from "lucide-react";
import { toast } from 'sonner';
import api from '@/lib/api';
import AnnouncementDetails from './AnnouncementDetails';
import moment from 'moment';
import { IconBrandWhatsapp, IconMail, IconMessage2 } from '@tabler/icons-react';

const AnnouncementList = ({ eventId, announcements, loading, onRefresh }) => {
    const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 2;

    useEffect(() => {
        applyFilters();
    }, [announcements, searchTerm, statusFilter, priorityFilter, typeFilter]);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, priorityFilter, typeFilter]);

    const applyFilters = () => {
        let filtered = [...announcements];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(a =>
                a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.message.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(a => a.status === statusFilter);
        }

        // Priority filter
        if (priorityFilter !== 'all') {
            filtered = filtered.filter(a => a.priority === priorityFilter);
        }

        // Type filter
        if (typeFilter !== 'all') {
            filtered = filtered.filter(a => a.messageType === typeFilter);
        }

        setFilteredAnnouncements(filtered);
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { variant: "outline", icon: Clock },
            scheduled: { variant: "secondary", icon: Calendar },
            sent: { variant: "default", icon: CheckCircle },
            failed: { variant: "destructive", icon: XCircle },
            partial: { variant: "outline", icon: AlertCircle },
            cancelled: { variant: "outline", icon: XCircle }
        };

        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;

        return (
            <Badge variant={config.variant} className="flex items-center gap-1 text-xs">
                <Icon className="h-3 w-3" />
                <span className="hidden sm:inline">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
            </Badge>
        );
    };

    const getPriorityBadge = (priority) => {
        const priorityConfig = {
            low: { variant: "outline" },
            normal: { variant: "secondary" },
            high: { variant: "destructive" }
        };

        const config = priorityConfig[priority] || priorityConfig.normal;

        return (
            <Badge variant={config.variant} className="text-xs">
                <span className="hidden sm:inline">{priority.charAt(0).toUpperCase() + priority.slice(1)}</span>
                <span className="sm:hidden">{priority.charAt(0).toUpperCase()}</span>
            </Badge>
        );
    };

    const getMessageTypeIcon = (type) => {
        const icons = {
            whatsapp: <IconBrandWhatsapp className="h-3 w-3 sm:h-4 sm:w-4" />,
            email: <IconMail className="h-3 w-3 sm:h-4 sm:w-4" />,
            both: <IconMessage2 className="h-3 w-3 sm:h-4 sm:w-4" />
        };
        return icons[type] || icons.both;
    };

    const handleRetryAnnouncement = async (announcementId) => {
        try {
            const response = await api.post(`/event/admin/announcement/${eventId}/${announcementId}/retry`);
            if (response.data.success) {
                toast.success("Announcement retry initiated");
                onRefresh();
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to retry announcement";
            const errorDetails = error.response?.data?.error?.details;
            toast.error(errorMessage);
            if (errorDetails) {
                toast.error(errorDetails);
            }
            console.error("Retry error:", error);
        }
    };

    const handleCancelAnnouncement = async (announcementId) => {
        try {
            const response = await api.delete(`/event/admin/announcement/${eventId}/${announcementId}`);
            if (response.data.success) {
                toast.success("Announcement cancelled");
                onRefresh();
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to cancel announcement";
            const errorDetails = error.response?.data?.error?.details;
            toast.error(errorMessage);
            if (errorDetails) {
                toast.error(errorDetails);
            }
            console.error("Cancel error:", error);
        }
    };

    const canRetry = (announcement) => {
        return announcement.status === 'failed' || announcement.status === 'partial';
    };

    const canCancel = (announcement) => {
        return announcement.status === 'scheduled' || announcement.status === 'pending';
    };

    // Pagination calculations
    const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentAnnouncements = filteredAnnouncements.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <Card key={i} className="animate-pulse">
                        <CardContent className="p-4">
                            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-muted rounded w-1/2"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Filters */}
            <div className="flex flex-col gap-2">
                <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                    <Input
                        placeholder="Search announcements..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 h-8 text-sm"
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="h-8 text-xs flex-1">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="sent">Sent</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                            <SelectItem value="partial">Partial</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                        <SelectTrigger className="h-8 text-xs flex-1 sm:w-32">
                            <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Priority</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="h-8 text-xs flex-1 sm:w-32">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="whatsapp">WhatsApp</SelectItem>
                            <SelectItem value="both">Both</SelectItem>
                        </SelectContent>
                    </Select> */}

                    <Button variant="outline" size="sm" onClick={onRefresh} className="h-8 px-2 sm:px-3">
                        <RefreshCw className="h-3 w-3" />
                        <span className="hidden sm:inline ml-1">Refresh</span>
                    </Button>
                </div>
            </div>

            {/* Announcements List */}
            <div className="space-y-2">
                {filteredAnnouncements.length === 0 ? (
                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="text-muted-foreground text-sm">
                                {announcements.length === 0 ?
                                    "No announcements created yet" :
                                    "No announcements match your filters"
                                }
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {currentAnnouncements.map((announcement) => (
                            <Card key={announcement._id} className="hover:shadow-sm transition-shadow">
                                <CardContent className="">
                                    <div className="sm:items-start justify-between gap-3">
                                        <div className="w-full">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                                <h3 className="font-medium truncate text-sm sm:text-base max-w-1/2">{announcement.title}</h3>
                                                <div className="flex gap-1">
                                                    {getStatusBadge(announcement.status)}
                                                    {getPriorityBadge(announcement.priority)}
                                                </div>
                                            </div>

                                            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 w-full">
                                                {announcement.message}
                                            </p>

                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-xs text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    {getMessageTypeIcon(announcement.messageType)}
                                                    <span className="text-xs sm:text-sm">{announcement.messageType}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span>{announcement.participantCount} recipients</span>
                                                    <span>{moment(announcement.createdAt).fromNow()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1 sm:ml-2 justify-end sm:justify-start">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setSelectedAnnouncement(announcement)}
                                                        className="h-7 w-7 p-0 sm:h-8 sm:w-8"
                                                    >
                                                        <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-4xl w-[95vw] max-h-[95vh] overflow-y-auto">
                                                    <AnnouncementDetails
                                                        eventId={eventId}
                                                        announcement={selectedAnnouncement}
                                                    />
                                                </DialogContent>
                                            </Dialog>

                                            {canRetry(announcement) && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRetryAnnouncement(announcement._id)}
                                                    className="h-7 w-7 p-0 sm:h-8 sm:w-8"
                                                    title="Retry"
                                                >
                                                    <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
                                                </Button>
                                            )}

                                            {canCancel(announcement) && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleCancelAnnouncement(announcement._id)}
                                                    className="h-7 w-7 p-0 sm:h-8 sm:w-8 text-destructive hover:text-destructive"
                                                    title="Cancel"
                                                >
                                                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-4">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious 
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (currentPage > 1) handlePageChange(currentPage - 1);
                                                }}
                                                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                            />
                                        </PaginationItem>
                                        
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <PaginationItem key={page}>
                                                <PaginationLink
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handlePageChange(page);
                                                    }}
                                                    isActive={currentPage === page}
                                                    className="cursor-pointer"
                                                >
                                                    {page}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}
                                        
                                        <PaginationItem>
                                            <PaginationNext 
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (currentPage < totalPages) handlePageChange(currentPage + 1);
                                                }}
                                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AnnouncementList;
