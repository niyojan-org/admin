import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { IconCheck, IconX, IconClock, IconProgress } from '@tabler/icons-react';
import { formatWaitTime, formatDate } from '../utils/helpers';

/**
 * Display rate limits and sending capability
 */
export const LimitsCard = ({ limits, loading }) => {
  console.log(limits)
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-60 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!limits) return null;

  const { canSend, limits: limitsData } = limits;
  const { rateLimit, dailyLimit } = limitsData;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Send Status</CardTitle>
            <CardDescription>
              Rate limits and availability
            </CardDescription>
          </div>
          <Badge variant={canSend ? 'success' : 'destructive'} className="gap-1">
            {canSend ? (
              <>
                <IconCheck className="h-3 w-3" />
                Can Send
              </>
            ) : (
              <>
                <IconX className="h-3 w-3" />
                Limited
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Rate Limit Info */}
        {rateLimit.enabled && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <IconClock className="h-4 w-4" />
                Time Gap
              </span>
              <span className="font-medium text-foreground">
                {rateLimit.minimumGapMinutes} minutes required
              </span>
            </div>
            
            {rateLimit.lastAnnouncementAt && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last Sent</span>
                  <span className="font-medium text-foreground">
                    {formatDate(rateLimit.lastAnnouncementAt)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  "{rateLimit.lastAnnouncementTitle}"
                </div>
              </div>
            )}

            {rateLimit.waitTimeMinutes > 0 && (
              <Alert className="border-orange-200 bg-orange-50">
                <IconClock className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  {formatWaitTime(rateLimit.waitTimeMinutes)}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Daily Limit Info */}
        {dailyLimit.enabled && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <IconProgress className="h-4 w-4" />
                Today's Usage
              </span>
              <span className="font-medium text-foreground">
                {dailyLimit.usedToday} / {dailyLimit.maxPerDay}
              </span>
            </div>
            
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  dailyLimit.remainingToday === 0
                    ? 'bg-destructive'
                    : dailyLimit.remainingToday <= 2
                    ? 'bg-orange-500'
                    : 'bg-green-500'
                }`}
                style={{
                  width: `${(dailyLimit.usedToday / dailyLimit.maxPerDay) * 100}%`,
                }}
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Remaining</span>
              <Badge variant={dailyLimit.remainingToday > 0 ? 'secondary' : 'destructive'}>
                {dailyLimit.remainingToday} left
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
