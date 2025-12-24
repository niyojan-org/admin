import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { IconCircleCheck, IconAlertTriangle, IconAlertCircle, IconInfoCircle, IconBulb } from '@tabler/icons-react';

/**
 * Display AI-generated insights and recommendations
 */
export const InsightsCard = ({ insights, loading }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!insights || insights.length === 0) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg">Insights</CardTitle>
          <CardDescription>Smart recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No insights available at the moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getInsightIcon = (type) => {
    const iconProps = { className: "h-5 w-5" };
    switch (type) {
      case 'success':
        return <IconCircleCheck {...iconProps} className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <IconAlertTriangle {...iconProps} className="h-5 w-5 text-yellow-600" />;
      case 'alert':
        return <IconAlertCircle {...iconProps} className="h-5 w-5 text-red-600" />;
      case 'info':
      default:
        return <IconInfoCircle {...iconProps} className="h-5 w-5 text-blue-600" />;
    }
  };

  const getInsightStyle = (type) => {
    switch (type) {
      case 'success':
        return { color: 'text-green-700', bg: 'bg-green-50 border-green-200' };
      case 'warning':
        return { color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200' };
      case 'alert':
        return { color: 'text-red-700', bg: 'bg-red-50 border-red-200' };
      case 'info':
      default:
        return { color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' };
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">Insights</CardTitle>
        <CardDescription>
          AI-powered recommendations and alerts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight, index) => {
          const style = getInsightStyle(insight.type);
          
          return (
            <Alert key={index} className={style.bg}>
              <div className="flex items-start gap-3">
                {getInsightIcon(insight.type)}
                <div className="flex-1 space-y-1">
                  <AlertDescription className={`${style.color} font-medium`}>
                    {insight.message}
                  </AlertDescription>
                  {insight.action && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <IconBulb className="h-3 w-3" />
                      {insight.action}
                    </p>
                  )}
                </div>
              </div>
            </Alert>
          );
        })}
      </CardContent>
    </Card>
  );
};
