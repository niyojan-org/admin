"use client";
import { IconStar, IconStarFilled } from "@tabler/icons-react";
import React from "react";

export default function TicketCardSelectable({
  ticketName,
  price,
  badge,
  selected = false,
  soldOut = false,
  onClick,
}) {
  return (
    <div
      onClick={!soldOut ? onClick : undefined}
      className={`
        relative h-16 rounded-sm flex w-full justify-start items-center transition-all duration-300
        ${selected ? "border border-primary ring-2 ring-primary" : "border border-muted-foreground/50"}
        ${soldOut
          ? "cursor-not-allowed"
          : "cursor-pointer hover:scale-[1.01] hover:shadow-sm"
        }
      `}
    >

      <div className={`flex items-center justify-center w-5 shrink-0 border-r h-full text-sm ${selected && "border-primary bg-primary text-primary-foreground font-medium"}`}>
        <p className="text-sm rotate-90 whitespace-nowrap">Orgatick</p>
      </div>

      <div className={`relative w-full flex-col items-center flex-1 justify-center h-full flex `}>
        <h3 className={`${selected ? "font-semibold tracking-wider" : "font-medium "} capitalize ${soldOut && "opacity-30"}`}>{ticketName}</h3>
        <div className={`h-[0.05rem] w-full bg-linear-to-r from-transparent  ${selected ? "via-primary" : "via-border"} to-transparent ${soldOut && "opacity-30"}`} />
        {/* <p className={`ticket-price text-primary ${selected ? "font-semibold" : "font-medium"} ${soldOut && "opacity-30"}`}>{price === 0 ? "Free" : `₹${price}`}</p> */}

        {soldOut && <span className="absolute inset-0 flex items-center justify-center font-semibold text-destructive bg-destructive/10">Sold Out</span>}
      </div>

      {badge && badge === 'best' && <span className={`absolute right-0 top-0 p-1 ${selected ? "text-primary" : "text-muted-foreground"} ${soldOut && "opacity-30"}`}><IconStarFilled size={15} /></span>}
      {badge && badge === 'interesting' && <span className={`absolute right-0 top-0 p-1 ${selected ? "text-primary" : "text-muted-foreground"} ${soldOut && "opacity-30"}`}><IconStar size={15} /></span>}


    </div>
  );
}
