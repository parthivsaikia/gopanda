import { AlertCircle } from "lucide-react";
export default function ErrorComponent({ error }: { error: string }) {
  return (
    <div className="flex items-center justify-center">
      <AlertCircle />
      <div className="text-red-500 text-sm ">{error}</div>
    </div>
  );
}
