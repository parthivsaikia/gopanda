import { AlertCircle } from "lucide-react";

// Updated FieldError component that reserves space to prevent layout shift
const StableFieldError = ({ field }: { field: any }) => {
  const hasError =
    field.state.meta.errors && field.state.meta.errors.length > 0;

  return (
    <div className="h-6 mt-1 flex items-start">
      {hasError && (
        <div className="flex gap-1 animate-in slide-in-from-top-1 duration-200 items-center">
          <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
          <span className="text-red-600 text-sm font-medium leading-tight">
            {field.state.meta.errors.join(", ")}
          </span>
        </div>
      )}
    </div>
  );
};

export default StableFieldError;
