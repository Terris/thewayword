import { Input } from "./Input";

export function DatePicker({
  dateAsISOString,
  setDate,
  placeholder = "Pick a date",
}: {
  dateAsISOString: string | undefined;
  setDate: (dateAsString: string | undefined) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-row gap-2">
      <Input
        value={dateAsISOString}
        type="date"
        placeholder={placeholder}
        onChange={(e) => {
          setDate(e.currentTarget.value);
        }}
      />
    </div>
  );
}
