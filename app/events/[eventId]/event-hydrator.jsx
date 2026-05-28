"use client";

import { useEffect } from "react";

import { EventStore } from "./event-store";

function EventHydrator({ event }) {
  const setEvent = EventStore((state) => state.setEvent);

  useEffect(() => {
    if (!event) return;

    const currentEvent = EventStore.getState().event;
    const currentId = currentEvent?.slug || currentEvent?._id;
    const nextId = event?.slug || event?._id;

    if (!currentEvent || currentId !== nextId) {
      setEvent(event);
    }
  }, [event, setEvent]);

  return null;
}

export default EventHydrator;
