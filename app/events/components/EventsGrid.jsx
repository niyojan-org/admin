import EventCard from "./EventCard";

export default function EventsGrid({ events }) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event._id} event={event} />
      ))}
    </div>
  );
}
