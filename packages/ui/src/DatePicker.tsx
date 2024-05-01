"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@repo/utils";
import { Button } from "./Button";
import { Calendar } from "./Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { useState } from "react";

export function DatePicker({
  dateAsISOString,
  setDate,
}: {
  dateAsISOString: string | undefined;
  setDate: (dateAsIsoString: string | undefined) => void;
}) {
  const [open, setOpen] = useState(false);
  const date = dateAsISOString ? new Date(dateAsISOString) : undefined;
  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => {
            setDate(d?.toISOString());
            setOpen(false);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
