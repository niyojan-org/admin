"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReviewStep({ groupName, leaderForm, groupMembers, allFields }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-center">Review Your Group Details</h3>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <CardTitle>Leader</CardTitle>
          <div className="space-y-2">
            <p className="font-medium text-primary">Group Name: {groupName}</p>
            {allFields.map((f) => (
              <div key={f.name} className="flex justify-between border-b py-1">
                <span className="text-muted-foreground">{f.label}</span>
                <span>{leaderForm[f.name] || "-"}</span>
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Members</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {groupMembers.map((m, idx) => (
              <div key={idx} className="p-3 border rounded-lg">
                <h4 className="font-semibold text-sm">Member {idx + 2}</h4>
                {allFields.map((f) => (
                  <div key={f.name} className="flex justify-between border-b py-1">
                    <span className="text-muted-foreground">{f.label}</span>
                    <span>{m[f.name] || "-"}</span>
                  </div>
                ))}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
