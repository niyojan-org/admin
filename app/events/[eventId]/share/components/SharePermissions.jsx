import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../components/ui/card';
import { Checkbox } from '../../../../../components/ui/checkbox';
import { Label } from '../../../../../components/ui/label';

export default function SharePermissions({ permissions, onToggle }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Share Permissions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(permissions).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-2">
              <Checkbox
                id={key}
                checked={value}
                onCheckedChange={() => onToggle(key)}
              />
              <Label 
                htmlFor={key}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {key}
              </Label>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <p className="text-xs text-muted-foreground">
            Configure what actions are allowed when users access your shared event link.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
