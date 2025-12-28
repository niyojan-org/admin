import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  IconBrandWhatsapp, 
  IconMail, 
  IconDeviceMobile, 
  IconAlertCircle, 
  IconCircleDot,
  IconClock,
  IconBolt
} from '@tabler/icons-react';

/**
 * Display performance metrics broken down by various dimensions
 */
export const PerformanceMetrics = ({ metrics, loading }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-60 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!metrics) {
    return null;
  }

  const { byMessageType, byPriority, byScheduling, deliveryTime } = metrics;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
        <CardDescription>
          Detailed breakdown by type, priority, and scheduling
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="messageType">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="messageType">Message Type</TabsTrigger>
            <TabsTrigger value="priority">Priority</TabsTrigger>
            <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
          </TabsList>

          {/* By Message Type */}
          <TabsContent value="messageType" className="space-y-3 mt-4">
            {byMessageType && byMessageType.length > 0 ? (
              byMessageType.map((item) => (
                <div key={item.messageType} className="border rounded-lg p-4 space-y-2 hover:bg-accent/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-medium capitalize flex items-center gap-2">
                      {item.messageType === 'whatsapp' && <><IconBrandWhatsapp className="h-5 w-5 text-green-600" /> WhatsApp</>}
                      {item.messageType === 'email' && <><IconMail className="h-5 w-5 text-blue-600" /> Email</>}
                      {item.messageType === 'both' && <><IconDeviceMobile className="h-5 w-5 text-purple-600" /> Both</>}
                    </span>
                    <span className="text-sm font-bold text-green-600">
                      {item.successRate}% success
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Announcements</div>
                      <div className="font-medium text-foreground">{item.announcements}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Sent</div>
                      <div className="font-medium text-green-600">{item.sent}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Failed</div>
                      <div className="font-medium text-red-600">{item.failed}</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No data available
              </p>
            )}
          </TabsContent>

          {/* By Priority */}
          <TabsContent value="priority" className="space-y-3 mt-4">
            {byPriority && byPriority.length > 0 ? (
              byPriority.map((item) => (
                <div key={item.priority} className="border rounded-lg p-4 space-y-2 hover:bg-accent/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-medium capitalize flex items-center gap-2">
                      {item.priority === 'high' && <><IconAlertCircle className="h-5 w-5 text-red-600" /> High Priority</>}
                      {item.priority === 'normal' && <><IconCircleDot className="h-5 w-5 text-blue-600" /> Normal Priority</>}
                      {item.priority === 'low' && <><IconCircleDot className="h-5 w-5 text-green-600" /> Low Priority</>}
                    </span>
                    <span className="text-sm font-bold text-green-600">
                      {item.successRate}% success
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Announcements</div>
                      <div className="font-medium text-foreground">{item.announcements}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Sent</div>
                      <div className="font-medium text-green-600">{item.sent}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Failed</div>
                      <div className="font-medium text-red-600">{item.failed}</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No data available
              </p>
            )}
          </TabsContent>

          {/* By Scheduling */}
          <TabsContent value="scheduling" className="space-y-3 mt-4">
            {byScheduling && byScheduling.length > 0 ? (
              <>
                {byScheduling.map((item) => (
                  <div key={item.type} className="border rounded-lg p-4 space-y-2 hover:bg-accent/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-medium capitalize flex items-center gap-2">
                        {item.type === 'immediate' && <><IconBolt className="h-5 w-5 text-orange-600" /> Immediate</>}
                        {item.type === 'scheduled' && <><IconClock className="h-5 w-5 text-blue-600" /> Scheduled</>}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Announcements</div>
                        <div className="font-medium">{item.announcements}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Sent</div>
                        <div className="font-medium text-green-600">{item.sent}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Failed</div>
                        <div className="font-medium text-red-600">{item.failed}</div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Delivery Time Stats */}
                {deliveryTime && (
                  <div className="border border-blue-200 rounded-lg p-4 space-y-2 bg-blue-50">
                    <div className="font-medium flex items-center gap-2 text-blue-900">
                      <IconClock className="h-5 w-5 text-blue-600" />
                      Delivery Time
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Average</div>
                        <div className="font-medium text-foreground">{deliveryTime.average}s</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Minimum</div>
                        <div className="font-medium">{deliveryTime.minimum}s</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Maximum</div>
                        <div className="font-medium">{deliveryTime.maximum}s</div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No data available
              </p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
