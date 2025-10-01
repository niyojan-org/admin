"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconInfoSquareRounded, IconPlus, IconTrash } from "@tabler/icons-react";

export default function TicketsStep({ eventData, updateTicket, addTicket, removeTicket }) {
  // Predefined ticket types
  const ticketTypes = [
    { value: "Regular", label: "Regular" },
    { value: "VIP", label: "VIP" },
    { value: "VVIP", label: "VVIP" },
    { value: "Student", label: "Student" },
    { value: "Early Bird", label: "Early Bird" },
    { value: "Group", label: "Group" },
    { value: "Custom", label: "Custom" }
  ];

  return (
    <Card className={"flex-1"}>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-navy">Ticket Configuration</h2>
          <div className="flex gap-2">
            <Button onClick={addTicket} variant="outline" size="sm">
              <IconPlus className="h-4 w-4 mr-2" />
              Add Ticket Type
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <button className="text-navy hover:text-blue-700">
                  <IconInfoSquareRounded className="h-5 w-5" />
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ticket Guidelines</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-sm text-gray-600">
                  <p>• Create different ticket types for different access levels</p>
                  <p>• Set appropriate pricing and capacity limits</p>
                  <p>• Use template URLs for custom ticket designs</p>
                  <p>• Consider early bird discounts and group rates</p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="space-y-6">
          {eventData.tickets.map((ticket, index) => {
            return (
              <div key={index} className="border rounded-lg p-4 space-y-4 bg-card">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-navy">Ticket Type {index + 1}</h3>
                  {eventData.tickets.length > 1 && (
                    <Button
                      onClick={() => removeTicket(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <IconTrash className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Ticket Type *</Label>
                    <Select
                      value={ticket.type}
                      onValueChange={(value) => updateTicket(index, "type", value)}
                    >
                      <SelectTrigger className="w-full bg-white">
                        <SelectValue placeholder="Select ticket type" />
                      </SelectTrigger>
                      <SelectContent>
                        {ticketTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {/* Custom input for "Custom" ticket type */}
                    {ticket.type === "Custom" && (
                      <Input
                        value={ticket.customType || ""}
                        onChange={(e) => updateTicket(index, "customType", e.target.value)}
                        placeholder="Enter custom ticket type"
                        className="bg-white mt-2"
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Price (₹) *</Label>
                    <Input
                      type="number"
                      min="0"
                      value={ticket.price}
                      onChange={(e) => {
                        const value = e.target.value;
                        updateTicket(index, "price", value === '' ? '' : parseInt(value) || 0);
                      }}
                      placeholder="0"
                      className="bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Capacity *</Label>
                    <Input
                      type="number"
                      min="1"
                      value={ticket.capacity}
                      onChange={(e) => {
                        const value = e.target.value;
                        updateTicket(index, "capacity", value === '' ? '' : parseInt(value) || 1);
                      }}
                      placeholder="50"
                      className="bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Template URL (Optional)</Label>
                  <Input
                    value={ticket.templateUrl}
                    onChange={(e) => updateTicket(index, "templateUrl", e.target.value)}
                    placeholder="URL to custom ticket template"
                    className="bg-white"
                  />
                </div>

                {/* Ticket Type Preview */}
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span>Preview:</span>
                  <div className="px-3 py-1 rounded-full border bg-muted">
                    {ticket.type === "Custom" && ticket.customType ? ticket.customType : ticket.type}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
