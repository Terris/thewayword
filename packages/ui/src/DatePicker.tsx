"use client";

import { useState } from "react";
import { isValid, parse } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "./Button";
import { Calendar } from "./Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { Input } from "./Input";

export function DatePicker({
  dateAsISOString,
  setDate,
  placeholder = "Pick a date",
}: {
  dateAsISOString: string | undefined;
  setDate: (dateAsIsoString: string | undefined) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const date = dateAsISOString ? new Date(dateAsISOString) : undefined;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsedDate = parse(e.target.value, "MM/dd/yyyy", new Date());
    if (isValid(parsedDate)) {
      setDate(parsedDate.toISOString());
    }
    setInputValue(e.target.value);
  };

  return (
    <div className="flex flex-row gap-2">
      <Input
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
      />
      <Popover
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
        }}
      >
        <PopoverTrigger asChild>
          <Button variant="outline">
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            defaultMonth={date}
            onSelect={(d) => {
              setDate(d?.toISOString());
              setOpen(false);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
