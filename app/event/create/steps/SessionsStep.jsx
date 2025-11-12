"use client";
import React from "react";
import Sessions from "../../[eventId]/components/Sessions";

export default function SessionsStep({ event, setEvent }) {


  return (
    <Sessions className={'flex-1 h-full'} eventId={event?._id} event={event} />
  );
}
