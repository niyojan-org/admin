import { Registration } from '../registration-type';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconCreditCard, IconInfoCircle } from '@tabler/icons-react';

interface RightSidebarProps {
  registration: Registration;
}

export function RightSidebar({ registration }: RightSidebarProps) {
  return (
    <div className="space-y-4 sticky top-24">
      {/* Quick Action Card */}
      <Card className="gap-1">
        <CardHeader className="font-semibold">Quick Actions</CardHeader>
        <CardContent className="space-y-2">
          <Button className="w-full">Generate Invoice</Button>
          <Button className="w-full">Resend Confirmations</Button>
          <Button className="w-full" variant="destructive">
            Cancel Registration
          </Button>
        </CardContent>
      </Card>

      {/* Payment Summary Card */}
      <Card className="gap-1">
        <CardHeader className="flex items-center gap-2">
          <IconCreditCard size={18} />
          <h3 className="font-semibold">Payment Summary</h3>
        </CardHeader>
        <CardContent>
          {registration.pricing ? (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Amount</span>
                <span>
                  {registration.pricing.currency} {registration.pricing.total.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Status</span>
                <span className={`font-semibold ${getPaymentStatusColor(registration.status)}`}>
                  {getPaymentStatusLabel(registration.status)}
                </span>
              </div>
              <div className="h-px border-t" />
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span className="font-semibold">
                  {registration.pricing.currency} {registration.pricing.tax.toFixed(2)}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-secondary-foreground text-sm">No pricing information available</p>
          )}
        </CardContent>
      </Card>
      {/* Registration Details Card */}
      <Card className="gap-1">
        <CardHeader className="flex items-center gap-2">
          <IconInfoCircle size={18} />
          <h3 className="font-semibold">Details</h3>
        </CardHeader>
        <CardContent>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide mb-1">Registration ID</p>
            <div className="flex items-center gap-2">
              <code className="text-xs flex-1 overflow-hidden text-ellipsis">{registration._id}</code>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide">Created</p>
            <p className="text-sm">{format(new Date(registration.createdAt), 'MMM dd, yyyy HH:mm')}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide">Last Updated</p>
            <p className="text-sm">{format(new Date(registration.updatedAt), 'MMM dd, yyyy HH:mm')}</p>
          </div>{' '}
        </CardContent>
      </Card>
    </div>
  );
}

function getPaymentStatusColor(status: string): string {
  const colors: Record<string, string> = {
    CONFIRMED: 'text-emerald-400',
    PENDING_PAYMENT: 'text-yellow-400',
    DRAFT: 'text-slate-400',
    APPROVAL_PENDING: 'text-orange-400',
    FAILED: 'text-red-400',
    CANCELLED: 'text-slate-400',
  };
  return colors[status] || 'text-slate-400';
}

function getPaymentStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    CONFIRMED: 'Paid',
    PENDING_PAYMENT: 'Pending',
    DRAFT: 'Draft',
    APPROVAL_PENDING: 'Pending Approval',
    FAILED: 'Failed',
    CANCELLED: 'Cancelled',
  };
  return labels[status] || status;
}
