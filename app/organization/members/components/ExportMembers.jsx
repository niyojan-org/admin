"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, FileSpreadsheet, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const ExportMembers = ({ 
  members, 
  filters, 
  summary 
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportComplete, setExportComplete] = useState(false);
  const [exportError, setExportError] = useState('');

  const exportFormats = [
    {
      id: 'csv',
      label: 'CSV File',
      description: 'Comma-separated values',
      icon: FileSpreadsheet,
      extension: '.csv'
    },
    {
      id: 'excel',
      label: 'Excel Workbook',
      description: 'Microsoft Excel format',
      icon: FileSpreadsheet,
      extension: '.xlsx'
    },
    {
      id: 'json',
      label: 'JSON File',
      description: 'JavaScript Object Notation',
      icon: FileText,
      extension: '.json'
    }
  ];

  const generateCSV = (data) => {
    const headers = [
      'Name',
      'Email',
      'Phone',
      'Role',
      'Status',
      'Verified',
      'Gender',
      'Join Date'
    ];

    const rows = data.map(member => [
      member.name || '',
      member.email || '',
      member.phone_number || '',
      member.organization?.role || '',
      member.organization?.status || '',
      member.isVerified ? 'Yes' : 'No',
      member.gender || '',
      member.organization?.joinedAt || member.createdAt || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    return csvContent;
  };

  const generateJSON = (data) => {
    const exportData = {
      exportDate: new Date().toISOString(),
      totalMembers: data.length,
      filters: filters,
      summary: summary,
      members: data.map(member => ({
        id: member._id,
        name: member.name,
        email: member.email,
        phone: member.phone_number,
        role: member.organization?.role,
        status: member.organization?.status,
        verified: member.isVerified,
        gender: member.gender,
        joinDate: member.organization?.joinedAt || member.createdAt,
        avatar: member.avatar
      }))
    };

    return JSON.stringify(exportData, null, 2);
  };

  const downloadFile = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const simulateProgress = () => {
    setExportProgress(0);
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);
    return interval;
  };

  const handleExport = async (format) => {
    setIsExporting(true);
    setShowProgress(true);
    setExportComplete(false);
    setExportError('');

    const progressInterval = simulateProgress();

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      let content;
      let filename;
      const timestamp = new Date().toISOString().split('T')[0];
      const baseName = `organization-members-${timestamp}`;

      switch (format.id) {
        case 'csv':
          content = generateCSV(members);
          filename = `${baseName}.csv`;
          break;
        case 'json':
          content = generateJSON(members);
          filename = `${baseName}.json`;
          break;
        case 'excel':
          // For Excel, we'll just use CSV for now
          content = generateCSV(members);
          filename = `${baseName}.csv`;
          break;
        default:
          throw new Error('Unsupported export format');
      }

      // Complete the progress
      clearInterval(progressInterval);
      setExportProgress(100);

      // Download the file
      downloadFile(content, filename);

      // Show completion
      setTimeout(() => {
        setExportComplete(true);
        setTimeout(() => {
          setShowProgress(false);
          setIsExporting(false);
        }, 2000);
      }, 500);

    } catch (error) {
      clearInterval(progressInterval);
      setExportError(error.message || 'Export failed');
      setIsExporting(false);
    }
  };

  const closeDialog = () => {
    if (!isExporting) {
      setShowProgress(false);
      setExportComplete(false);
      setExportError('');
      setExportProgress(0);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" disabled={members.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5 text-sm font-medium text-gray-700">
            Export Members ({members.length})
          </div>
          <DropdownMenuSeparator />
          {exportFormats.map((format) => {
            const Icon = format.icon;
            return (
              <DropdownMenuItem
                key={format.id}
                onClick={() => handleExport(format)}
                disabled={isExporting}
              >
                <Icon className="w-4 h-4 mr-2" />
                <div className="flex flex-col">
                  <span>{format.label}</span>
                  <span className="text-xs text-gray-500">{format.description}</span>
                </div>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Export Progress Dialog */}
      <Dialog open={showProgress} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {exportComplete ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : exportError ? (
                <AlertCircle className="w-5 h-5 text-red-500" />
              ) : (
                <Loader2 className="w-5 h-5 animate-spin" />
              )}
              {exportComplete ? 'Export Complete' : exportError ? 'Export Failed' : 'Exporting Members'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {exportError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{exportError}</AlertDescription>
              </Alert>
            ) : exportComplete ? (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Your member export has been downloaded successfully.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{exportProgress}%</span>
                  </div>
                  <Progress value={exportProgress} className="h-2" />
                </div>
                <p className="text-sm text-gray-600">
                  Preparing your member data for export...
                </p>
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              onClick={closeDialog}
              disabled={isExporting && !exportError}
              variant={exportError ? 'default' : 'outline'}
            >
              {exportComplete || exportError ? 'Close' : 'Cancel'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExportMembers;
