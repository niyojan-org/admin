import { cn } from "@/lib/utils";

function CalendarCard({ date, className }) {
  if (!date) return null;

  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) return null;

  const day = parsedDate.getDate();
  const month = parsedDate.toLocaleString("en-US", { month: "short" });
  const year = parsedDate.getFullYear();

  return (
    <div
      className={cn(
        "p-0.5 px-4 rounded-xl w-fit flex flex-col items-center -space-y-1 border",
        className,
      )}
    >
      <p className="text-3xl font-bold">{day}</p>
      <p className="">{month}</p>
      <p className="text-sm">{year}</p>
    </div>
  );
}

export default CalendarCard;
