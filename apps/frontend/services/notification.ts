import { toast } from "sonner";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Enable relative time plugin for "time ago" formatting
dayjs.extend(relativeTime);

type MessageStyle = "success" | "info" | "error";

export function notify(message: string, urgency: MessageStyle) {
  const now = dayjs();

  return toast[urgency](message, {
    description: `${now.format("MMM D, YYYY")} at ${now.format("h:mm A")}`,
  });
}
