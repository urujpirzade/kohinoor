'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Calendar,
  FileText,
  Table,
  Download,
  AlertCircle,
  Info,
} from 'lucide-react';

interface ReportsPageState {
  startDate: string;
  endDate: string;
  isLoading: boolean;
  error: string | null;
  emptyResults: boolean;
}

const ReportsPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [state, setState] = useState<ReportsPageState>({
    startDate: '',
    endDate: '',
    isLoading: false,
    error: null,
    emptyResults: false,
  });

  // Check if user has permission to access this page
  useEffect(() => {
    if (status === 'loading') return; // Wait for session to load

    if (!session) {
      router.push('/login');
      return;
    }

    const userRole = session.user?.role;
    if (userRole !== 'ROOT' && userRole !== 'ADMIN') {
      router.push('/dashboard'); // Redirect to dashboard if not authorized
    }
  }, [session, status, router]);

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render the page if user is not authorized
  const userRole = session?.user?.role;
  if (userRole !== 'ROOT' && userRole !== 'ADMIN') {
    return null;
  }

  // Date validation - end date must be >= start date
  const isDateRangeValid = () => {
    if (!state.startDate || !state.endDate) return false;
    return new Date(state.endDate) >= new Date(state.startDate);
  };

  // Check if both dates are selected
  const areDatesSelected = () => {
    return state.startDate && state.endDate;
  };

  // Check if buttons should be disabled
  const areButtonsDisabled = () => {
    return !areDatesSelected() || !isDateRangeValid() || state.isLoading;
  };

  // Handle date input changes
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({
      ...prev,
      startDate: e.target.value,
      error: null,
      emptyResults: false,
    }));
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({
      ...prev,
      endDate: e.target.value,
      error: null,
      emptyResults: false,
    }));
  };

  // Download handler function
  const handleDownload = async (format: 'pdf' | 'excel') => {
    if (!areDatesSelected() || !isDateRangeValid()) {
      setState((prev) => ({
        ...prev,
        error: !areDatesSelected()
          ? 'Please select both start and end dates'
          : 'End date must be on or after start date',
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      emptyResults: false,
    }));

    try {
      const response = await fetch('/api/reports/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: state.startDate,
          endDate: state.endDate,
          format,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate report');
      }

      // Check if response indicates empty results
      const contentLength = response.headers.get('content-length');
      if (contentLength === '0') {
        setState((prev) => ({ ...prev, emptyResults: true, isLoading: false }));
        return;
      }

      // Handle successful download
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // Get filename from Content-Disposition header or generate default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `event-report_${state.startDate}_to_${state.endDate}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to generate report. Please check your connection and try again.',
      }));
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className='flex-1 bg-white p-4 rounded-md m-4 mt-0'>
      {/* Page Header */}
      <div className='mb-6'>
        <div className='flex items-center gap-3 mb-2'>
          <div className='p-2 bg-primary/10 rounded-lg'>
            <FileText className='w-6 h-6 text-primary' />
          </div>
          <div>
            <h1 className='text-2xl md:text-3xl font-bold text-foreground'>
              Event Booking Reports
            </h1>
            <p className='text-muted-foreground text-sm md:text-base'>
              Generate and download comprehensive event booking reports
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <Card className='shadow-sm border-border/50'>
        <CardHeader className='pb-4'>
          <CardTitle className='flex items-center gap-2 text-lg'>
            <Calendar className='w-5 h-5 text-primary' />
            Report Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Date Range Selection */}
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold text-foreground flex items-center gap-2'>
              <Calendar className='w-4 h-4' />
              Select Date Range
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <label
                  htmlFor='startDate'
                  className='text-sm font-medium text-foreground flex items-center gap-1'
                >
                  Start Date
                  <span
                    className='text-destructive'
                    aria-label='Required field'
                  >
                    *
                  </span>
                </label>
                <Input
                  id='startDate'
                  type='date'
                  value={state.startDate}
                  onChange={handleStartDateChange}
                  className='w-full transition-colors focus:ring-2 focus:ring-primary/20'
                  disabled={state.isLoading}
                  aria-describedby={
                    !areDatesSelected() ? 'date-help' : undefined
                  }
                  aria-invalid={
                    areDatesSelected() && !isDateRangeValid() ? 'true' : 'false'
                  }
                />
              </div>

              <div className='space-y-2'>
                <label
                  htmlFor='endDate'
                  className='text-sm font-medium text-foreground flex items-center gap-1'
                >
                  End Date
                  <span
                    className='text-destructive'
                    aria-label='Required field'
                  >
                    *
                  </span>
                </label>
                <Input
                  id='endDate'
                  type='date'
                  value={state.endDate}
                  onChange={handleEndDateChange}
                  className='w-full transition-colors focus:ring-2 focus:ring-primary/20'
                  disabled={state.isLoading}
                  min={state.startDate || undefined}
                  aria-describedby={
                    !areDatesSelected() ? 'date-help' : undefined
                  }
                  aria-invalid={
                    areDatesSelected() && !isDateRangeValid() ? 'true' : 'false'
                  }
                />
              </div>
            </div>

            {/* Help Text */}
            {!areDatesSelected() && (
              <div
                id='date-help'
                className='text-xs text-muted-foreground flex items-start gap-2'
              >
                <Info className='w-3 h-3 mt-0.5 shrink-0' />
                <span>
                  Select both start and end dates to enable report generation
                </span>
              </div>
            )}

            {/* Date Validation Error */}
            {areDatesSelected() && !isDateRangeValid() && (
              <div
                className='text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-start gap-2'
                role='alert'
                aria-live='polite'
              >
                <AlertCircle className='w-4 h-4 mt-0.5 shrink-0' />
                <span>End date must be on or after start date</span>
              </div>
            )}
          </div>

          {/* Download Section */}
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold text-foreground flex items-center gap-2'>
              <Download className='w-4 h-4' />
              Download Options
            </h3>

            {/* Download Buttons */}
            <div className='flex flex-col sm:flex-row gap-3'>
              <Button
                onClick={() => handleDownload('pdf')}
                disabled={areButtonsDisabled()}
                className='flex items-center gap-2 min-h-[44px] transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed'
                variant='default'
                size='lg'
                aria-describedby='pdf-help'
              >
                {state.isLoading ? (
                  <div className='animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent' />
                ) : (
                  <FileText className='w-4 h-4' />
                )}
                Download as PDF
              </Button>

              <Button
                onClick={() => handleDownload('excel')}
                disabled={areButtonsDisabled()}
                className='flex items-center gap-2 min-h-[44px] transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed'
                variant='outline'
                size='lg'
                aria-describedby='excel-help'
              >
                {state.isLoading ? (
                  <div className='animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent' />
                ) : (
                  <Table className='w-4 h-4' />
                )}
                Download as Excel
              </Button>
            </div>

            {/* Format Help Text */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-muted-foreground'>
              <div id='pdf-help' className='flex items-start gap-2'>
                <FileText className='w-3 h-3 mt-0.5 shrink-0' />
                <span>
                  PDF format is ideal for sharing, printing, and archiving
                  reports
                </span>
              </div>
              <div id='excel-help' className='flex items-start gap-2'>
                <Table className='w-3 h-3 mt-0.5 shrink-0' />
                <span>
                  Excel format allows for further data analysis and calculations
                </span>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          <div className='space-y-3'>
            {/* Loading State */}
            {state.isLoading && (
              <div
                className='text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2'
                role='status'
                aria-live='polite'
              >
                <div className='animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent' />
                <span>Generating report... Please wait</span>
              </div>
            )}

            {/* Error Message */}
            {state.error && (
              <div
                className='text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-start gap-2'
                role='alert'
                aria-live='assertive'
              >
                <AlertCircle className='w-4 h-4 mt-0.5 shrink-0' />
                <div>
                  <div className='font-medium'>Error generating report</div>
                  <div className='mt-1'>{state.error}</div>
                </div>
              </div>
            )}

            {/* Empty Results Message */}
            {state.emptyResults && (
              <div
                className='text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2'
                role='alert'
                aria-live='polite'
              >
                <Info className='w-4 h-4 mt-0.5 shrink-0' />
                <div>
                  <div className='font-medium'>No records found</div>
                  <div className='mt-1'>
                    No event bookings were found for the selected date range.
                    Try selecting a different date range.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Additional Information */}
          {/* <div className='bg-muted/30 border border-border/50 rounded-lg p-4'>
            <h4 className='text-sm font-medium text-foreground mb-2 flex items-center gap-2'>
              <Info className='w-4 h-4' />
              Report Information
            </h4>
            <div className='text-xs text-muted-foreground space-y-1'>
              <p>
                • Reports include all event bookings within the selected date
                range
              </p>
              <p>
                • Data includes client names, event types, amounts, and booking
                status
              </p>
              <p>
                • Summary statistics show total bookings and revenue for the
                period
              </p>
              <p>• All monetary values are displayed in Indian Rupees (₹)</p>
            </div>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;
