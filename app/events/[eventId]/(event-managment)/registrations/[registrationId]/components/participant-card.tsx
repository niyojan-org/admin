import { Participant } from '../registration-type';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconCheck, IconMail, IconSend } from '@tabler/icons-react';

interface ParticipantCardProps {
  participant: Participant;
  index: number;
  total: number;
}

export function ParticipantCard({ participant }: ParticipantCardProps) {
  return (
    <div>
      <Card className="overflow-hidden">
        <div>
          <CardContent>
            {/* Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Email</p>

                <p className="break-all text-sm">{participant.email}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Phone</p>

                <p className="text-sm">{participant.phone}</p>
              </div>
            </div>

            {/* Ticket */}
            <div>
              <p className="text-xs text-muted-foreground">Ticket ID</p>

              <p className="break-all text-sm">{participant.ticketId}</p>
            </div>

            {/* Timeline */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Status</p>

              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-primary" />
                Registered
              </div>

              <div className="flex items-center gap-2 text-sm">
                <div
                  className={`h-2 w-2 rounded-full ${participant.status === 'CHECKED_IN' ? 'bg-primary' : 'bg-muted'}`}
                />
                Checked In
              </div>
            </div>

            {/* Notifications */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Notifications</p>

              <div className="flex items-center gap-2 text-sm">
                <IconMail className="h-4 w-4" />
                Email Sent
                {participant.notifications.emailSent && <IconCheck className="ml-auto h-4 w-4" />}
              </div>

              <div className="flex items-center gap-2 text-sm">
                <IconSend className="h-4 w-4" />
                WhatsApp Sent
                {participant.notifications.whatsAppSent && <IconCheck className="ml-auto h-4 w-4" />}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-4">
              <Button variant="outline" className="flex-1">
                View Details
              </Button>

              <Button variant="outline" className="flex-1">
                Send Ticket
              </Button>

              {participant.status !== 'CHECKED_IN' && <Button className="flex-1">Check In</Button>}
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
