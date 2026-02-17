"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Switch } from "@/components/ui/switch";
import { IconPlus, IconTrash, IconTicket, IconUsers } from "@tabler/icons-react";
import { useEventForm } from "../hooks/useEventForm";
import { Badge } from "@/components/ui/badge";

export default function TicketsStep() {
  const { eventDraft, tickets } = useEventForm();
  const [expandedTicket, setExpandedTicket] = useState(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Ticket Types</h2>
          <p className="text-muted-foreground">Configure ticket pricing and availability</p>
        </div>
        <Button onClick={() => tickets.add()} className="gap-2">
          <IconPlus className="w-4 h-4" />
          Add Ticket
        </Button>
      </div>

      {eventDraft.tickets.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <IconTicket className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No ticket types added yet</p>
            <Button 
              onClick={() => tickets.add()} 
              variant="outline" 
              className="mt-4 gap-2"
            >
              <IconPlus className="w-4 h-4" />
              Add Your First Ticket
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {eventDraft.tickets.map((ticket, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      Ticket {index + 1}
                      {ticket.isGroupTicket && (
                        <Badge variant="secondary" className="gap-1">
                          <IconUsers className="w-3 h-3" />
                          Group
                        </Badge>
                      )}
                    </CardTitle>
                    {ticket.type && (
                      <p className="text-sm text-muted-foreground mt-1">{ticket.type}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedTicket(expandedTicket === index ? null : index)}
                    >
                      {expandedTicket === index ? "Collapse" : "Expand"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => tickets.remove(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <IconTrash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {expandedTicket === index && (
                <CardContent className="space-y-4 pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Ticket Type *</Label>
                      <Input
                        placeholder="e.g., Early Bird, VIP, General"
                        value={ticket.type || ""}
                        onChange={(e) => tickets.update(index, { type: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Price *</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={ticket.price || 0}
                        onChange={(e) => tickets.update(index, { price: parseFloat(e.target.value) || 0 })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Capacity *</Label>
                      <Input
                        type="number"
                        min="1"
                        placeholder="100"
                        value={ticket.capacity || ""}
                        onChange={(e) => tickets.update(index, { capacity: parseInt(e.target.value) || 0 })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Sales Start</Label>
                      <DateTimePicker
                        value={ticket.salesStartTime ? new Date(ticket.salesStartTime) : null}
                        onChange={(date) => tickets.update(index, { salesStartTime: date?.toISOString() })}
                        use12HourFormat={true}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Sales End</Label>
                      <DateTimePicker
                        value={ticket.salesEndTime ? new Date(ticket.salesEndTime) : null}
                        onChange={(date) => tickets.update(index, { salesEndTime: date?.toISOString() })}
                        use12HourFormat={true}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t pt-4">
                    <div className="space-y-0.5">
                      <Label>Group Ticket</Label>
                      <p className="text-sm text-muted-foreground">Allow group registrations</p>
                    </div>
                    <Switch
                      checked={ticket.isGroupTicket || false}
                      onCheckedChange={(checked) => tickets.update(index, { isGroupTicket: checked })}
                    />
                  </div>

                  {ticket.isGroupTicket && (
                    <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
                      <h4 className="font-semibold flex items-center gap-2">
                        <IconUsers className="w-4 h-4" />
                        Group Settings
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Minimum Participants</Label>
                          <Input
                            type="number"
                            min="2"
                            placeholder="2"
                            value={ticket.groupSettings?.minParticipants || 2}
                            onChange={(e) => tickets.update(index, {
                              groupSettings: {
                                ...ticket.groupSettings,
                                minParticipants: parseInt(e.target.value) || 2
                              }
                            })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Maximum Participants</Label>
                          <Input
                            type="number"
                            min="2"
                            placeholder="10"
                            value={ticket.groupSettings?.maxParticipants || 10}
                            onChange={(e) => tickets.update(index, {
                              groupSettings: {
                                ...ticket.groupSettings,
                                maxParticipants: parseInt(e.target.value) || 10
                              }
                            })}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Group Leader Required</Label>
                          <p className="text-sm text-muted-foreground">Require designation of a group leader</p>
                        </div>
                        <Switch
                          checked={ticket.groupSettings?.groupLeaderRequired || false}
                          onCheckedChange={(checked) => tickets.update(index, {
                            groupSettings: {
                              ...ticket.groupSettings,
                              groupLeaderRequired: checked
                            }
                          })}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t pt-4">
                    <div className="space-y-0.5">
                      <Label>Ticket Active</Label>
                      <p className="text-sm text-muted-foreground">Make this ticket available for purchase</p>
                    </div>
                    <Switch
                      checked={ticket.isActive ?? true}
                      onCheckedChange={(checked) => tickets.update(index, { isActive: checked })}
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
